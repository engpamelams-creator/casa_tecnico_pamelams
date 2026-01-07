"""
solucao_logica.py

Enterprise-grade implementation of the Raffle System Logic.
Uses strong typing, secure randomness, and structured logging.

Author: Pamela Menezes
"""

import logging
import secrets
from dataclasses import dataclass, field
from typing import List, Optional, Set

# --- Configuration (Logging) ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# --- Domain Entities ---

@dataclass
class Bilhete:
    """Represents a single raffle ticket."""
    numero: int
    comprador: str
    
    def __post_init__(self):
        # Validation runs automatically upon creation
        if self.numero < 1:
            raise ValueError("O número do bilhete deve ser positivo.")

@dataclass
class RifaConfig:
    """Configuration Object pattern."""
    total_bilhetes: int = 100
    nome_evento: str = "Ação Entre Amigos"

# --- Main Service ---

class RifaService:
    """
    Manages the lifecycle of a Raffle with thread-safe (conceptual) operations
    and cryptographic randomness.
    """
    
    def __init__(self, config: RifaConfig):
        self.config = config
        self._bilhetes_vendidos: Set[int] = set()
        self._compradores: List[Bilhete] = []
        self._is_open: bool = True
        logger.info(f"Rifa '{config.nome_evento}' inicializada com {config.total_bilhetes} bilhetes.")

    def vender_bilhete(self, numero: int, nome_comprador: str) -> bool:
        """
        Attempts to sell a ticket.
        
        Args:
            numero: Ticket number.
            nome_comprador: Name of the buyer.
            
        Returns:
            bool: True if success, False otherwise.
        """
        if not self._is_open:
            logger.warning("Tentativa de compra com rifa fechada.")
            return False

        # boundary check
        if not (1 <= numero <= self.config.total_bilhetes):
            logger.error(f"Número inválido: {numero}. Intervalo permitido: 1-{self.config.total_bilhetes}")
            return False

        # uniqueness check
        if numero in self._bilhetes_vendidos:
            logger.warning(f"Conflito: Bilhete {numero} já pertence a outro comprador.")
            return False

        # Transaction commit
        novo_bilhete = Bilhete(numero=numero, comprador=nome_comprador)
        self._bilhetes_vendidos.add(numero)
        self._compradores.append(novo_bilhete)
        
        logger.info(f"Venda registrada: Bilhete {numero} para {nome_comprador}")
        return True

    def realizar_sorteio(self) -> Optional[Bilhete]:
        """
        Performs the draw using CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
        """
        if not self._compradores:
            logger.error("Impossível sortear: Urna vazia.")
            return None

        # 'secrets' module is cryptographically strong, unlike 'random'
        vencedor = secrets.choice(self._compradores)
        
        self._is_open = False # Close raffle
        logger.info(f"🏆 Sorteio realizado com sucesso! Vencedor: {vencedor.comprador} (Bilhete {vencedor.numero})")
        
        return vencedor

# --- Execution Example ---

if __name__ == "__main__":
    # Setup
    config = RifaConfig(total_bilhetes=100)
    service = RifaService(config)

    # Simulation
    service.vender_bilhete(10, "Pamela")
    service.vender_bilhete(42, "João")
    service.vender_bilhete(99, "Maria")
    
    # Tentativa de erro
    service.vender_bilhete(10, "Hacker") # Deve falhar

    # Draw
    service.realizar_sorteio()
