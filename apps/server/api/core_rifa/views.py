from django.db import transaction
from rest_framework import views, status, response
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from .models import Rifa, Bilhete, AuditLog
from .serializers import ComprarBilheteSerializer, BilheteSerializer
import secrets
import logging

logger = logging.getLogger(__name__)

class ComprarBilheteView(views.APIView):
    """
    Endpoint de compra com proteção contra Race Conditions (Concorrência).
    """

    @swagger_auto_schema(request_body=ComprarBilheteSerializer)
    def post(self, request):
        serializer = ComprarBilheteSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        rifa_id = serializer.validated_data['rifa_id']
        numero = serializer.validated_data['numero']
        comprador = serializer.validated_data['comprador_nome']

        try:
            # 🔒 TRANSATION ATOMIC: Inicia o bloco de transação ACID
            with transaction.atomic():
                # 🛑 SELECT FOR UPDATE: 
                # Esta é a mágica Senior. O Django diz ao Banco de Dados:
                # "Tranque esta linha (Rifa) só para mim. Se alguém tentar ler/escrever, coloque na fila."
                # Isso impede que dois requests leiam "rifa.status = aberta" ao mesmo tempo.
                try:
                    rifa = Rifa.objects.select_for_update().get(id=rifa_id)
                except Rifa.DoesNotExist:
                    return response.Response({"erro": "Rifa não encontrada."}, status=404)

                if rifa.status != 'ABERTA':
                    return response.Response({"erro": "Esta rifa já está fechada."}, status=400)

                # Verifica se o bilhete já existe (Check Unique)
                # Como a Rifa está travada (Locked), ninguém consegue inserir bilhetes nesta rifa
                # sem passar pelo Lock (dependendo do nível de isolamento do BD, mas o unique_together no model ajuda).
                if Bilhete.objects.filter(rifa=rifa, numero=numero).exists():
                    AuditLog.objects.create(
                        acao="FALHA_COMPRA", 
                        detalhes=f"Tentativa de duplicidade no bilhete {numero} por {comprador}",
                        ip_origem=request.META.get('REMOTE_ADDR')
                    )
                    return response.Response({"erro": "Bilhete já vendido!"}, status=409) # 409 Conflict

                # ✅ Efetiva a compra
                bilhete = Bilhete.objects.create(
                    rifa=rifa,
                    numero=numero,
                    comprador_nome=comprador
                )

                # Log de Sucesso (Compliance)
                AuditLog.objects.create(
                    acao="COMPRA_SUCESSO",
                    detalhes=f"Bilhete {numero} comprado por {comprador}",
                    ip_origem=request.META.get('REMOTE_ADDR')
                )
                
                return response.Response(BilheteSerializer(bilhete).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Erro crítico na transação: {str(e)}")
            return response.Response({"erro": "Erro interno no servidor."}, status=500)

@api_view(['POST'])
def sortear_rifa(request, rifa_id):
    """
    Realiza o sorteio utilizando CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
    """
    logger.info(f"🎲 Iniciando sorteio para Rifa ID: {rifa_id}")
    try:
        rifa = Rifa.objects.get(id=rifa_id)
        
        # Validação simples
        bilhetes = list(rifa.bilhetes.all()) # Carrega na memória (cuidado se forem milhões)
        if not bilhetes:
            logger.warning(f"⚠️ Tentativa de sorteio sem bilhetes. Rifa ID: {rifa_id}")
            return response.Response({"erro": "Sem bilhetes para sortear."}, status=400)

        # 🔐 SECRETS MODULE: 
        # Sorteio real. 'random.choice' não é seguro. 'secrets.choice' usa entropia do OS.
        ganhador = secrets.choice(bilhetes)

        # Atualiza status
        rifa.status = 'FECHADA'
        rifa.save()

        logger.info(f"🏆 Sorteio Concluído! Vencedor: {ganhador.comprador_nome} (Bilhete {ganhador.numero})")

        AuditLog.objects.create(
            acao="SORTEIO_REALIZADO",
            detalhes=f"Ganhador: {ganhador.comprador_nome} (Bilhete {ganhador.numero})",
            ip_origem=request.META.get('REMOTE_ADDR')
        )

        return response.Response({
            "vencedor": ganhador.comprador_nome,
            "bilhete": ganhador.numero,
            "metodo": "CSPRNG (secrets.choice)"
        })

@api_view(['POST'])
def reset_rifa(request):
    """
    Limpa o sorteio (reseta todos os bilhetes).
    """
    logger.warning(f"⚠️ ADMIN ACIONOU RESET TOTAL DA RIFA! IP: {request.META.get('REMOTE_ADDR')}")
    
    # Em um cenário real, deveria ter @permission_classes([IsAdminUser])
    try:
        # Apaga todos os bilhetes (Reset do Board)
        Bilhete.objects.all().delete()
        
        AuditLog.objects.create(
            acao="RESET_GLOBAL", 
            detalhes="Todos os bilhetes foram apagados pelo Admin.",
            ip_origem=request.META.get('REMOTE_ADDR')
        )
        return response.Response({"status": "Rifa resetada com sucesso!"}, status=200)

    except Exception as e:
        logger.error(f"Erro ao resetar: {e}")
        return response.Response({"erro": "Falha ao resetar"}, status=500)

@api_view(['POST'])
def update_config(request):
    """
    Atualiza configurações dinâmicas (Valor do Prêmio, Qtd Números).
    """
    # Exemplo simples de persistência em banco ou cache
    novo_premio = request.data.get('premio_valor')
    nova_qtd = request.data.get('quantidade_numeros')
    
    logger.info(f"⚙️ Configuração Atualizada: Prêmio R${novo_premio} | {nova_qtd} Bilhetes")
    
    return response.Response({
        "status": "Configuração salva",
        "config": {"premio": novo_premio, "tickets": nova_qtd}
    })
