<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d1117&height=200&section=header&text=Solu%C3%A7%C3%B5es%20T%C3%A9cnicas%20%26%20Insights&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Teoria%20aprofundada%20e%20C%C3%B3digo%20Limpo&descAlignY=60&descAlign=50" width="100%" />
</div>

<br />

<div align="center">
  <p>
    > *"Não basta o código funcionar. Ele precisa ser legível, escalável e resolver o problema certo."*
  </p>
  <a href="#-parte-1-domínio-teórico-deep-learning">📜 Teoria</a> •
  <a href="#%EF%B8%8F-parte-2-soluções-práticas-handson">💻 Prática</a> •
  <a href="#-bônus-sistema-de-rifas-completo">🎲 Sistema de Rifa</a>
</div>

---

## 🧠 Parte 1: Domínio Teórico (Deep Learning)

> *Clique nas perguntas abaixo para revelar as respostas.*

<details>
<summary><strong>❓ 1. O que é uma variável? (Conceito & Analogia)</strong></summary>
<br>

> **Resposta Senior:**
>
> Uma variável é uma **alocação nomeada de memória** que armazena um valor mutável durante o ciclo de vida de uma aplicação. Em arquitetura de software, variáveis bem nomeadas são a base da documentação do código.
>
> 🎰 **Analogia do Cassino:**
> Imagine um display digital acima de uma mesa de Poker chamado `ValorDoPote`. No início da rodada, ele mostra `R$ 0,00`. Conforme os jogadores apostam, o valor *varia* (R$ 50, R$ 100...). O display é a variável (o container), e o número brilhando nele é o valor (o dado).

</details>

<details>
<summary><strong>❓ 2. Função vs. Loop (Quando usar?)</strong></summary>
<br>

> **Resposta Senior:**
>
> *   **Função (Encapsulamento):** É um bloco de lógica isolado projetado para realizar uma tarefa única e reutilizável. Promove o princípio DRY (Don't Repeat Yourself).
> *   **Loop (Iteração):** É uma estrutura de controle de fluxo que repete instruções enquanto uma condição for verdadeira.
>
> 🎫 **No Sistema de Rifa:**
> *   **Função:** `sortearVencedor()` -> Uma ação que eu chamo quando preciso (no clique de um botão).
> *   **Loop:** `for (i = 1; i <= 100; i++)` -> A ação automática do sistema gerando os 100 números de bilhetes iniciais para o banco de dados.

</details>


<details>
<summary><strong>❓ 3. Estrutura de Dados para Jogo do Bicho</strong></summary>
<br>

> **Resposta Senior:**
>
> A escolha ideal é um **Array de Objetos** (`List<Object>` ou `Dictionary` dependendo da busca).
>
> **Por quê?**
> Dados reais são complexos. Um array simples `[50, 20, 10]` guardaria o valor, mas perderia o *contexto*.
> Um Objeto encapsula a entidade completa:
> ```json
> [
>   { "id": 1, "apostador": "Pamela", "animal": "Leão", "valor": 50.00, "timestamp": "2024-01-07" },
>   { "id": 2, "apostador": "João", "animal": "Gato", "valor": 20.00, "timestamp": "2024-01-07" }
> ]
> ```
> Isso permite filtrar, somar e auditar as apostas com facilidade.

</details>


<details>
<summary><strong>❓ 4. O Poder do 'If/Else' (Controle de Fluxo)</strong></summary>
<br>

> **Resposta Senior:**
> O `if/else` é a espinha dorsal da lógica de negócios. Ele direciona o comportamento do software baseando-se em estados.
>
> 💻 **Validação de Saldo (Clean Code):**
> ```javascript
> const validarTransacao = (saldo, aposta) => {
>   if (saldo < aposta) {
>     throw new Error("Saldo Insuficiente: Recarregue sua carteira.");
>   }
>   return true; // "Happy Path"
> }
> ```

</details>


<details>
<summary><strong>❓ 5. Divisão por Zero & Tratamento de Erro</strong></summary>
<br>

> **Resposta Senior:**
> Matematicamente indefinido, computacionalmente perigoso. Pode gerar `Infinity` (JS) ou `Exceptions` (Python/C#), quebrando a aplicação.
>
> 🛡️ **Defensive Programming:**
> Nunca confie em inputs externos.
> ```javascript
> function calcularProbabilidade(meusBilhetes, totalBilhetes) {
>   // Guard Clauses (Cláusula de Guarda)
>   if (totalBilhetes === 0) return 0; 
>   
>   return (meusBilhetes / totalBilhetes) * 100;
> }
> ```

</details>

---

## 🛠️ Parte 2: Soluções Práticas (Hands-on)

> *O código abaixo prioriza legibilidade e princípios SOLID.*

### 🎲 Exercício 1: Engine de Sorteio
Gera um número cryptographically random (simulado) dentro de um range seguro.

```javascript
/* src/javascript/exercicio1.js */
const sortearNumero = () => {
    // Math.random() é pseudo-aleatório, mas suficiente para jogos não-críticos
    // O +1 garante que o intervalo seja inclusivo [1, 100]
    return Math.floor(Math.random() * 100) + 1;
};
```

### 💰 Exercício 2: Validador de Regras de Negócio
Garante a integridade financeira da transação antes de processá-la.

```javascript
/* src/javascript/exercicio2.js */
function podeApostar(saldoAtual, custoAposta) {
    // Validação negativa primeiro (Fail Fast)
    if (custoAposta <= 0) return false;
    
    // Retorna o resultado booleano direto
    return saldoAtual >= custoAposta;
}
```

### 🏆 Exercício 3: Analytics de Vitórias
Processamento de dados utilizando Programação Funcional (`.filter`).

```javascript
/* src/javascript/exercicio3.js */
const calcularScore = (historicoPartidas) => {
    if (!historicoPartidas?.length) return 0; // Null Safety
    
    // Abordagem declarativa: "O que eu quero" (filtrar ganhos) vs "Como fazer" (loops for)
    return historicoPartidas.filter(status => status === 'ganhou').length;
};
```

### 🔢 Exercício 4: Motor de Cálculo (Strategy Pattern Simplificado)
Calcula payouts dinâmicos baseados no tipo de jogo, evitando magic numbers.

```javascript
/* src/javascript/exercicio4.js */
const MULTIPLICADORES = {
    'grupo': 18,
    'animal': 2,
    'padrao': 0
};

function calcularPayout(tipoAposta, valorInvestido) {
    // Fallback para 'padrao' se o tipo não existir no dicionário
    const fator = MULTIPLICADORES[tipoAposta] || MULTIPLICADORES['padrao'];
    return valorInvestido * fator;
}
```

### 🕵️ Exercício 5: Filtragem de High Rollers
Extração de dados qualificados de uma massa de usuários.

```javascript
/* src/javascript/exercicio5.js */
function encontrarJogadoresVIP(listaJogadores, saldoMinimo) {
    // Imutabilidade: Retorna uma nova lista sem alterar a original
    return listaJogadores.filter(p => p.saldo >= saldoMinimo);
}
```

---

## 💎 Bônus: Sistema de Rifa Completo

Este módulo foi implementado como uma **Classe Funcional**, encapsulando estado e comportamento. Isso facilita testes unitários e manutenção futura.

```javascript
/**
 * src/javascript/desafio_rifa.js
 * 
 * Sistema de Gestão de Rifas v1.0
 * Features: Controle de vendas, verificação de duplicidade e sorteio justo.
 */

const criarRifaService = (totalBilhetes = 100) => {
    // Estado privado (Closure)
    const _vendidos = new Set(); // Set garante unicidade O(1)
    let _isOpen = true;

    return {
        vender: (numero) => {
            if (!_isOpen) throw new Error("Sorteio encerrado.");
            if (numero < 1 || numero > totalBilhetes) throw new Error("Número inválido.");
            if (_vendidos.has(numero)) throw new Error("Bilhete indisponível.");

            _vendidos.add(numero);
            return { sucesso: true, msg: `Bilhete ${numero} confirmado.` };
        },

        sortear: () => {
            if (_vendidos.size === 0) return null;
            
            const arrayVendas = Array.from(_vendidos);
             // Sorteio justo baseado nos vendidos
            const index = Math.floor(Math.random() * arrayVendas.length);
            
            _isOpen = false; // Fecha a rifa após sorteio
            return arrayVendas[index];
        },
        
        getStatus: () => ({ total: totalBilhetes, vendidos: _vendidos.size })
    };
};
```

---

<div align="center">
  <img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="50" />
  <br/>
  <sub><i>"Technology is best when it brings people together."</i></sub>
</div>
