/**
 * Sistema de Rifa - Desafio Técnico
 * 
 * Implementação seguindo a estrutura funcional estrita com validações críticas de negócio.
 */

// 1. Criar rifa
function criarRifa(totalBilhetes) {
    // Inicializa o estado da rifa.
    // 'total': Armazena o limite máximo de bilhetes para validação de range.
    // 'vendidos': Set foi escolhido pela eficiência O(1) na verificação de duplicidade.
    return {
        total: totalBilhetes,
        vendidos: new Set()
    };
}

// 2. Vender bilhete
function venderBilhete(rifa, numeroBilhete) {
    // Validação de Integridade: O número deve ser positivo.
    if (numeroBilhete < 1) {
        console.error(`Erro: Bilhete ${numeroBilhete} inválido (deve ser maior que 0).`);
        return;
    }

    // Validação Crítica A: Integridade do Limite
    // Garante que não vendemos bilhetes fora do range estipulado na criação.
    if (numeroBilhete > rifa.total) {
        console.error(`Erro: Bilhete ${numeroBilhete} excede o total de ${rifa.total}.`);
        return;
    }

    // Validação Crítica B: Unicidade (Idempotência)
    // Impede que o mesmo ativo (bilhete) seja vendido para dois clientes diferentes.
    if (rifa.vendidos.has(numeroBilhete)) {
        console.error(`Erro: Bilhete ${numeroBilhete} já foi vendido.`);
        return;
    }

    // Efetivação da venda (Commit)
    rifa.vendidos.add(numeroBilhete);
    console.log(`Sucesso: Bilhete ${numeroBilhete} vendido.`);
}

// 3. Sortear ganhador
function sortearGanhador(rifa) {
    // Validação Crítica C: Pré-condição de Sorteio
    // Não faz sentido sortear se não houver candidatos elegíveis. Evita erros de cálculo (divisão por zero/undefined).
    if (rifa.vendidos.size === 0) {
        return "Erro: Nenhum bilhete vendido. Sorteio cancelado.";
    }

    // Estratégia de Sorteio: Pool Restrito
    // Convertemos o Set para Array para permitir acesso por índice aleatório.
    // O sorteio é feito APENAS entre os vendidos, maximizando a chance real de alguém ganhar (100% se houver venda).
    const arrayVendidos = Array.from(rifa.vendidos);

    // Gera um índice aleatório dentro do tamanho do array de vendidos
    const indiceSorteado = Math.floor(Math.random() * arrayVendidos.length);

    return arrayVendidos[indiceSorteado];
}

// 4. Exemplo de uso (Teste)
console.log("--- Iniciando Testes do Sistema de Rifa ---");

let minhaRifa = criarRifa(100);

// Teste de Venda Válida
venderBilhete(minhaRifa, 5);
venderBilhete(minhaRifa, 10);
venderBilhete(minhaRifa, 23);

// Teste Validação A (Limite)
venderBilhete(minhaRifa, 101); // Deve falhar

// Teste Validação B (Duplicidade)
venderBilhete(minhaRifa, 5);   // Deve falhar

// Teste Validação C (Sorteio)
const ganhador = sortearGanhador(minhaRifa);
console.log(`\n🎉 Ganhador Sorteado: Bilhete ${ganhador}`);

// Validação extra: Sortear sem vendas
console.log("\n--- Teste Sorteio Vazio ---");
let rifaVazia = criarRifa(50);
console.log(sortearGanhador(rifaVazia));
