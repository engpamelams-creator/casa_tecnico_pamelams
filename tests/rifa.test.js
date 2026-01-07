// Importamos a lógica principal
// Adjusted path to point to the actual source file
const { RifaService } = require('../src/javascript/desafio_rifa');

describe('🧪 Suíte de Testes - Sistema de Rifa (Core Logic)', () => {

    let rifa;

    // Antes de cada teste, limpamos o estado do Singleton
    beforeEach(() => {
        rifa = new RifaService(50);
        rifa.reset(); // Crucial: Limpa o estado global entre testes
    });

    test('✅ Deve permitir comprar um bilhete válido', async () => {
        const resultado = await rifa.comprarBilhete(10);
        expect(resultado.success).toBe(true);
        expect(rifa.vendidos.has(10)).toBe(true);
    });

    test('🚫 Não deve permitir comprar o mesmo bilhete duas vezes (Duplicidade)', async () => {
        await rifa.comprarBilhete(10);

        // Attempting to buy again should throw an error in our implementation
        await expect(rifa.comprarBilhete(10))
            .rejects
            .toThrow("O bilhete 10 infelizmente já foi vendido.");
    });

    test('🚫 Não deve permitir comprar bilhete fora do intervalo (Bug de Limite)', async () => {
        // Our implementation throws errors for invalid numbers
        await expect(rifa.comprarBilhete(-1)).rejects.toThrow("Número inválido");
        await expect(rifa.comprarBilhete(1000)).rejects.toThrow("Número inválido");
    });

    test('🎲 Deve sortear um ganhador que esteja na lista de vendidos', async () => {
        await rifa.comprarBilhete(1);
        await rifa.comprarBilhete(2);
        await rifa.comprarBilhete(3);

        const ganhador = rifa.realizarSorteio();

        // O ganhador DEVE ser 1, 2 ou 3
        expect([1, 2, 3]).toContain(ganhador);
    });

    test('⚠️ Deve retornar erro se tentar sortear sem vendas', () => {
        expect(() => rifa.realizarSorteio()).toThrow("Não há bilhetes vendidos");
    });
});
