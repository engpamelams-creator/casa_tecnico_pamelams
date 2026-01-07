# Teste Técnico - Estagiários | Candidata: Pamela Menezes

## Parte 1: Questões Teóricas

### Questão 1
Explique com suas palavras: O que é uma variável em programação? Dê um exemplo prático relacionado a um jogo de cassino.

**Resposta:**
Uma variável é um espaço na memória do computador reservado para guardar dados que podem mudar durante a execução do programa. É como uma "caixa" com uma etiqueta.
**Exemplo no Cassino:** Uma variável chamada `saldoDoJogador`. No início da noite, ela guarda o valor `R$ 100,00`. Se o jogador ganha uma aposta de 50 reais, o valor dentro dessa "caixa" é atualizado para `R$ 150,00`.

### Questão 2
Qual a diferença entre uma função e um loop? Dê um exemplo de quando você usaria cada um em um sistema de rifa.

**Resposta:**
- **Função:** É um bloco de código que realiza uma tarefa específica e pode ser reutilizado várias vezes. É como uma "fórmula" ou "ação".
- **Loop (Laço):** É uma estrutura que repete uma ação várias vezes até que uma condição seja atendida.
**Exemplo na Rifa:**
- Usaria uma **Função** chamada `sortearVencedor()` para conter a lógica de escolher um número.
- Usaria um **Loop** para gerar os 100 bilhetes da rifa (do número 1 ao 100) e colocá-los à venda.

### Questão 3
Em um jogo do bicho, você precisa armazenar os resultados de 100 apostas. Qual estrutura de dados você usaria? Por quê?

**Resposta:**
Eu usaria um **Array (Lista)** de Objetos.
**Por que?** O Array permite armazenar uma sequência ordenada de itens. Como cada aposta tem detalhes complexos (quem apostou, valor, animal escolhido), cada item do array seria um Objeto.
Exemplo: `[{ id: 1, animal: 'Leão', valor: 50 }, { id: 2, animal: 'Gato', valor: 20 }]`.

### Questão 4
Explique o que é um "if/else" e dê um exemplo prático: validar se um jogador tem saldo suficiente para fazer uma aposta.

**Resposta:**
O "if/else" é uma estrutura condicional de controle de fluxo. Ele permite que o código tome decisões: "SE (if) isso for verdade, faça X; SENÃO (else), faça Y".
**Exemplo:**
```javascript
if (saldoDoJogador >= valorDaAposta) {
    console.log("Aposta realizada com sucesso!");
} else {
    console.log("Saldo insuficiente. Faça uma recarga.");
}
```

### Questão 5
O que acontece se você tentar dividir um número por zero em programação? Como você evitaria esse erro em um cálculo de probabilidade?

**Resposta:** Dependendo da linguagem, pode causar um erro fatal (crash) ou retornar "Infinity" (infinito). Em cálculos de probabilidade, isso gera resultados inválidos. Como evitar: Sempre validando o divisor antes do cálculo. Exemplo: `if (totalDeBilhetes > 0) { return meusBilhetes / totalDeBilhetes; } else { return 0; }`

## Parte 2 e 3: Soluções Práticas
Nota Técnica: Para demonstrar organização e boas práticas de Engenharia de Software, os códigos funcionais e testáveis destes exercícios foram separados em arquivos .js na pasta /src deste repositório. Abaixo, apresento as soluções conforme solicitado.

### Exercício 1: Função de Sorteio
```javascript
// Função que retorna um número aleatório entre 1 e 100
function sortearNumero() {
    // Math.random() gera entre 0.0 e 1.0
    // Multiplicamos por 100 para ter entre 0.0 e 99.9
    // Math.floor arredonda para baixo (0 a 99)
    // Somamos +1 para ter o intervalo de 1 a 100
    return Math.floor(Math.random() * 100) + 1;
}
```

### Exercício 2: Validação de Aposta
```javascript
function validarAposta(saldo, valorAposta) {
    // Verifica se a aposta ou saldo são inválidos (menores ou iguais a zero/negativo)
    if (valorAposta <= 0 || saldo < 0) {
        return false;
    }
    // Retorna true se o saldo for maior ou igual a aposta
    return saldo >= valorAposta;
}
```

### Exercício 3: Contador de Vitórias
```javascript
function contarVitorias(resultados) {
    if (!resultados || resultados.length === 0) return 0;

    // Filtra apenas os itens que são 'ganhou' e conta o tamanho da lista filtrada
    const vitorias = resultados.filter(resultado => resultado === 'ganhou');
    return vitorias.length;
}
```

### Exercício 4: Cálculo de Prêmio
```javascript
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
```

### Exercício 5: Lista de Jogadores
```javascript
function filtrarJogadores(jogadores, valorMinimo) {
    // O método filter cria um novo array apenas com os elementos que retornam true na condição
    return jogadores.filter(jogador => jogador.saldo >= valorMinimo);
}
```

### Desafio Final: Sistema de Rifas
```javascript
// 1. Criar rifa
function criarRifa(totalBilhetes) {
    return {
        total: totalBilhetes,
        vendidos: [], // Armazena os números já comprados
        aberta: true
    };
}

// 2. Vender bilhete
function venderBilhete(rifa, numeroBilhete) {
    if (!rifa.aberta) return "Rifa fechada.";
    
    // Validações
    if (numeroBilhete < 1 || numeroBilhete > rifa.total) {
        console.log(`Erro: Bilhete ${numeroBilhete} inválido.`);
        return false;
    }
    if (rifa.vendidos.includes(numeroBilhete)) {
        console.log(`Erro: Bilhete ${numeroBilhete} já vendido.`);
        return false;
    }

    rifa.vendidos.push(numeroBilhete);
    console.log(`Bilhete ${numeroBilhete} vendido com sucesso!`);
    return true;
}

// 3. Sortear ganhador
function sortearGanhador(rifa) {
    if (rifa.vendidos.length === 0) {
        return "Não há bilhetes vendidos para sortear.";
    }

    // Escolhe um índice aleatório dentro da lista de vendidos
    const indiceAleatorio = Math.floor(Math.random() * rifa.vendidos.length);
    const numeroSorteado = rifa.vendidos[indiceAleatorio];
    
    return numeroSorteado;
}
```
