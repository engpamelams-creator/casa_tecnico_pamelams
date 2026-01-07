import random

def sistema_rifa_python():
    print("--- Sistema de Rifa em Python ---")

    # Configuração
    total_bilhetes = 100
    bilhetes_vendidos = []

    # Simulação de Vendas
    def vender_bilhete(numero):
        if numero < 1 or numero > total_bilhetes:
            return False
        if numero in bilhetes_vendidos:
            return False
        bilhetes_vendidos.append(numero)
        return True

    # Simulando algumas vendas
    vender_bilhete(10)
    vender_bilhete(25)
    vender_bilhete(42)

    print(f"Bilhetes vendidos: {bilhetes_vendidos}")

    # Sorteio
    if bilhetes_vendidos:
        ganhador = random.choice(bilhetes_vendidos)
        print(f"🎉 O bilhete ganhador foi: {ganhador}")
    else:
        print("Nenhum bilhete vendido.")

if __name__ == "__main__":
    sistema_rifa_python()
