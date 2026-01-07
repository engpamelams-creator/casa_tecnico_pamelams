import pytest
import sys
import os

# Adiciona a pasta src/python_scripts ao caminho para podermos importar
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/python_scripts')))

from solucao_logica import RifaService, RifaConfig  # Importando classes corretas

class TestRifaProfissional:
    
    @pytest.fixture
    def rifa(self):
        """Cria uma instância limpa da rifa para cada teste"""
        config = RifaConfig(total_bilhetes=50)
        return RifaService(config)

    def test_compra_sucesso(self, rifa):
        """Testa se uma compra normal funciona"""
        # Adicionado nome do comprador pois a assinatura exige
        assert rifa.vender_bilhete(10, "Tester") == True
        # Acesso ao set privado para verificação (apenas testes)
        assert 10 in rifa._bilhetes_vendidos

    def test_bloqueio_duplicidade(self, rifa):
        """Testa se o sistema bloqueia venda dupla (Critical Bug)"""
        rifa.vender_bilhete(20, "Comprador 1")
        resultado_segunda_tentativa = rifa.vender_bilhete(20, "Comprador 2")
        
        assert resultado_segunda_tentativa == False
        # Verifica se só tem 1 instância do 20
        assert len([b for b in rifa._compradores if b.numero == 20]) == 1

    def test_limites_invalidos(self, rifa):
        """Testa tentativas de Hack (números negativos ou gigantes)"""
        assert rifa.vender_bilhete(0, "Hacker") == False
        assert rifa.vender_bilhete(51, "Hacker") == False
        assert rifa.vender_bilhete(-99, "Hacker") == False

    def test_sorteio_justo(self, rifa):
        """Testa se o sorteio retorna um número válido"""
        rifa.vender_bilhete(5, "User A")
        rifa.vender_bilhete(15, "User B")
        
        vencedor_obj = rifa.realizar_sorteio()
        assert vencedor_obj.numero in [5, 15]

    def test_sorteio_vazio(self, rifa):
        """Testa comportamento quando ninguém comprou nada"""
        assert rifa.realizar_sorteio() is None
