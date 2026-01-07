from django.db import models
from django.core.exceptions import ValidationError

class Rifa(models.Model):
    """
    Representa o evento de sorteio.
    """
    nome = models.CharField(max_length=100, default="Grande Sorteio")
    valor_premio = models.DecimalField(max_digits=10, decimal_places=2)
    max_ganhadores = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=[('ABERTA', 'Aberta'), ('FECHADA', 'Fechada')],
        default='ABERTA'
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.status}"

class Bilhete(models.Model):
    """
    Representa um bilhete comprado.
    Possui Constraint de Unicidade para evitar duplicidade no banco.
    """
    rifa = models.ForeignKey(Rifa, on_delete=models.CASCADE, related_name='bilhetes')
    numero = models.PositiveIntegerField()
    comprador_nome = models.CharField(max_length=100)
    comprado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Constraint Composta: O mesmo número não pode se repetir na mesma rifa
        unique_together = ('rifa', 'numero')
        indexes = [
            models.Index(fields=['rifa', 'numero']),
        ]

    def __str__(self):
        return f"#{self.numero} - {self.comprador_nome}"

class AuditLog(models.Model):
    """
    Log de auditoria para rastreabilidade total (Compliance).
    """
    acao = models.CharField(max_length=50) # COMPRA, SORTEIO, FALHA
    detalhes = models.TextField()
    ip_origem = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.acao}"
