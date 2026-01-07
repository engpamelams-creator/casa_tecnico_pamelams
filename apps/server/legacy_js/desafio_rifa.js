/**
 * @file sistema_rifa.js
 * @description Core logic for the Raffle System. Refactored to meet production-grade standards.
 * @author Pamela Menezes
 */

const crypto = require('crypto');

/**
 * Custom Error class for domain-specific exceptions.
 * Allows us to catch Rifa-specific errors separately from generic system errors.
 */
class RifaError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'RifaError';
        this.code = code;
    }
}

/**
 * Simple Async Mutex simulation.
 * In production (Node.js cluster or microservices), we would use Redis (Redlock).
 * For a single process, this ensures atomic transactions.
 */
class TicketsMutex {
    constructor() {
        this.locked = false;
        this.queue = [];
    }

    async acquire() {
        if (this.locked) {
            // If locked, we wait in a Promise until released
            return new Promise(resolve => this.queue.push(resolve));
        }
        this.locked = true;
    }

    release() {
        if (this.queue.length > 0) {
            // Give the lock to the next waiting promise
            const resolve = this.queue.shift();
            resolve();
        } else {
            this.locked = false;
        }
    }
}

/**
 * RifaService (Singleton Pattern)
 * Encapsulates the complete lifecycle of a Raffle.
 */
class RifaService {
    constructor(totalBilhetes = 100) {
        if (RifaService.instance) {
            return RifaService.instance;
        }

        this.total = totalBilhetes;
        // Using Set for O(1) lookup performance - crucial for high volume validation
        this.vendidos = new Set();
        this.aberta = true;
        this.mutex = new TicketsMutex();

        RifaService.instance = this;
    }

    /**
     * Resets the service state. Useful for testing.
     */
    reset() {
        this.vendidos.clear();
        this.aberta = true;
    }

    /**
     * Process a ticket purchase safely with currency controls.
     * @param {number} numero - The ticket number desired.
     * @returns {Promise<object>} Result of the transaction.
     */
    async comprarBilhete(numero) {
        // 1. Critical Section Start - Acquire Lock
        await this.mutex.acquire();

        try {
            // Fail Fast Validations
            if (!this.aberta) {
                throw new RifaError("O sorteio já foi encerrado.", "RIFA_CLOSED");
            }

            if (!Number.isInteger(numero) || numero < 1 || numero > this.total) {
                throw new RifaError(`Número inválido. Escolha entre 1 e ${this.total}.`, "INVALID_NUMBER");
            }

            // Atomic Check: Set.has() is extremely fast
            if (this.vendidos.has(numero)) {
                throw new RifaError(`O bilhete ${numero} infelizmente já foi vendido.`, "TICKET_TAKEN");
            }

            // 2. State Mutation
            this.vendidos.add(numero);

            console.log(`[Transaction] Ticket #${numero} purchased successfully.`);
            return {
                success: true,
                ticket: numero,
                timestamp: new Date().toISOString()
            };

        } finally {
            // 3. Critical Section End - Always Release Lock
            this.mutex.release();
        }
    }

    /**
     * Performs a cryptographically secure draw.
     * @returns {number} The winning ticket number.
     */
    realizarSorteio() {
        if (this.vendidos.size === 0) {
            throw new RifaError("Não há bilhetes vendidos para realizar o sorteio.", "NO_TICKETS");
        }

        // Convert strict Set to Array for indexing
        const poolDeApostas = Array.from(this.vendidos);

        // Security Upgrade: replacing Math.random() with crypto.randomInt()
        // This prevents prediction attacks on the draw result.
        const winningIndex = crypto.randomInt(0, poolDeApostas.length);
        const vencedor = poolDeApostas[winningIndex];

        this.aberta = false; // Close the raffle
        console.log(`[Audit] Draw completed. Winner: Ticket #${vencedor}`);

        return vencedor;
    }

    getStatus() {
        return {
            totalTickets: this.total,
            soldCount: this.vendidos.size,
            isOpen: this.aberta
        };
    }
}

// Exporting the Singleton instance mainly, but Class for testing if needed
module.exports = new RifaService();
module.exports.RifaService = RifaService;
module.exports.RifaError = RifaError;
