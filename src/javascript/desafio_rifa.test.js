/**
 * @file sistema_rifa.test.js
 * @description Unit tests for Critical Business Logic.
 * Wraps a mini-test-runner to mimic Jest syntax without external dependencies.
 */

const { RifaService, RifaError } = require('./desafio_rifa');

// --- Mini Test Runner (MOCK JEST) ---
const describe = async (suiteName, fn) => {
    console.log(`\n🧪 SUITE: ${suiteName}`);
    await fn();
};

const test = async (testName, fn) => {
    try {
        await fn();
        console.log(`  ✅ PASS: ${testName}`);
    } catch (e) {
        console.error(`  ❌ FAIL: ${testName}`);
        console.error(`     Error: ${e.message}`);
    }
};

const expect = (actual) => ({
    toBe: (expected) => {
        if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
    },
    toThrow: (errorType) => {
        try {
            actual(); // Execute the function that should throw
        } catch (e) {
            if (errorType && !(e instanceof errorType)) {
                throw new Error(`Expected error type ${errorType.name} but got ${e.name}`);
            }
            return; // Success, it threw
        }
        throw new Error(`Expected function to throw ${errorType?.name || 'Error'}, but it didn't.`);
    },
    resolves: {
        toHaveProperty: async (prop) => {
            const res = await actual;
            if (!res.hasOwnProperty(prop)) throw new Error(`Object missing property ${prop}`);
        }
    },
    rejects: {
        toThrowCode: async (code) => {
            try {
                await actual;
            } catch (e) {
                if (e.code !== code) throw new Error(`Expected error code ${code} but got ${e.code}`);
                return;
            }
            throw new Error(`Expected promise to reject with code ${code}, but it resolved.`);
        }
    }
});

// --- EXECUTION OF TESTS ---

(async () => {
    const service = new RifaService(100);

    await describe('RifaService - Core Logic', async () => {

        // Reset state before tests
        service.reset();

        await test('Deve permitir uma compra válida (Happy Path)', async () => {
            const numero = 50;
            const result = await service.comprarBilhete(numero);
            expect(result.success).toBe(true);
            expect(service.getStatus().soldCount).toBe(1);
        });

        await test('Deve impedir venda de bilhete duplicado (Concurrency Safety)', async () => {
            // Tentativa de comprar o 50 novamente
            await expect(service.comprarBilhete(50)).rejects.toThrowCode('TICKET_TAKEN');
        });

        await test('Deve validar intervalo de bilhetes (Boundary Check)', async () => {
            await expect(service.comprarBilhete(101)).rejects.toThrowCode('INVALID_NUMBER');
            await expect(service.comprarBilhete(0)).rejects.toThrowCode('INVALID_NUMBER');
        });

        await test('Deve realizar o sorteio corretamente com CSPRNG', async () => {
            // Adds more data to pool
            await service.comprarBilhete(10);
            await service.comprarBilhete(20);

            const vencedor = service.realizarSorteio();

            // Check if winner is valid
            const validWinners = [50, 10, 20];
            if (!validWinners.includes(vencedor)) {
                throw new Error(`Winner ${vencedor} is not in the pool!`);
            }

            expect(service.getStatus().isOpen).toBe(false);
        });

        await test('Deve impedir compra após fechamento da rifa', async () => {
            await expect(service.comprarBilhete(30)).rejects.toThrowCode('RIFA_CLOSED');
        });

        await test('Deve impedir sorteio com urna vazia', async () => {
            service.reset(); // Limpa tudo
            expect(() => service.realizarSorteio()).toThrow(RifaError);
        });
    });

})();
