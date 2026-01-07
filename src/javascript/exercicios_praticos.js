
// Exercício 1: Função de Sorteio
// Função que retorna um número aleatório entre 1 e 100
function sortearNumero() {
    // Math.random() gera entre 0.0 e 1.0
    // Multiplicamos por 100 para ter entre 0.0 e 99.9
    // Math.floor arredonda para baixo (0 a 99)
    // Somamos +1 para ter o intervalo de 1 a 100
    return Math.floor(Math.random() * 100) + 1;
}

// Exercício 2: Validação de Aposta
function validarAposta(saldo, valorAposta) {
    // Verifica se a aposta ou saldo são inválidos (menores ou iguais a zero/negativo)
    if (valorAposta <= 0 || saldo < 0) {
        return false;
    }
    // Retorna true se o saldo for maior ou igual a aposta
    return saldo >= valorAposta;
}

// Exercício 3: Contador de Vitórias
function contarVitorias(resultados) {
    if (!resultados || resultados.length === 0) return 0;

    // Filtra apenas os itens que são 'ganhou' e conta o tamanho da lista filtrada
    const vitorias = resultados.filter(resultado => resultado === 'ganhou');
    return vitorias.length;
}

// Exercício 4: Cálculo de Prêmio
function calcularPremio(tipoAcerto, valorAposta) {
    let multiplicador = 0;

    if (tipoAcerto === 'grupo') {
        multiplicador = 18;
    } else if (tipoAcerto === 'animal') {
        multiplicador = 2;
    } else {
        // Se 'nenhum' ou qualquer outra coisa, multiplicador continua 0
        multiplicador = 0;
    }

    return valorAposta * multiplicador;
}

// Exercício 5: Lista de Jogadores
function filtrarJogadores(jogadores, valorMinimo) {
    // O método filter cria um novo array apenas com os elementos que retornam true na condição
    return jogadores.filter(jogador => jogador.saldo >= valorMinimo);
}

// Exporting functions for testing purposes (optional but good practice)
/* 
module.exports = {
    sortearNumero,
    validarAposta,
    contarVitorias,
    calcularPremio,
    filtrarJogadores
};
*/
