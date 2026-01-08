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

## 🧠 Parte 1: Questões Teóricas

> *Clique nas perguntas abaixo para revelar as respostas.*

<details>
<summary><strong>❓ Explique com suas palavras: O que é uma variável em programação? Dê um exemplo prático relacionado a um jogo de cassino.</strong></summary>
<br>

> **Minha Resposta:**
>
> Pra mim, criar uma variável é como pegar uma caixa vazia e colocar uma etiqueta nela. Eu uso essa caixa pra guardar informações que podem mudar enquanto o programa roda.
>
> 🎰 **No Cassino:**
> Pensa no painel digital que mostra o valor do prêmio acumulado, o `ValorDoPote`. No começo da noite, ele tá zerado (`R$ 0,00`). Conforme a galera vai apostando, eu preciso *variar* esse número (R$ 50, R$ 100...). O painel físico é minha variável, e o número brilhando nele é o valor que eu atualizo.

</details>

<details>
<summary><strong>❓ Qual a diferença entre uma função e um loop? Dê um exemplo de quando você usaria cada um em um sistema de rifa.</strong></summary>
<br>

> **Minha Resposta:**
>
> Eu vejo a **Função** como uma "ferramenta" especializada que eu deixo na minha caixa pra usar quando quiser. Ela resolve um problema específico e eu não preciso reescrever o código toda vez.
> Já o **Loop** é quando eu preciso que o computador trabalhe arduamente pra mim, repetindo a mesma tarefa chata várias vezes sem reclamar.
>
> 🎫 **Na minha Rifa:**
> *   **Função:** Criei a `sortearVencedor()`. Ela fica lá quietinha e só roda quando eu (ou o usuário) clico no botão de sortear.
> *   **Loop:** Usei um `for` pra gerar os 100 bilhetes iniciais. Em vez de eu criar um por um manualmente, mandei o loop fazer isso pra mim num piscar de olhos.

</details>


<details>
<summary><strong>❓ Em um jogo do bicho, você precisa armazenar os resultados de 100 apostas. Qual estrutura de dados você usaria? Por quê?</strong></summary>
<br>

> **Minha Resposta:**
>
> Com certeza eu usaria um **Array de Objetos**.
>
> **Meu raciocínio:**
> Se eu guardar só os valores num array simples tipo `[50, 20, 10]`, eu perco o contexto. Daqui a pouco eu não sei mais quem apostou o quê.
> Usando objetos, eu consigo manter tudo organizado, como se fosse uma ficha cadastral:
> ```json
> [
>   { "id": 1, "apostador": "Pamela", "bicho": "Leão", "valor": 50.00 },
>   { "id": 2, "apostador": "João", "bicho": "Gato", "valor": 20.00 }
> ]
> ```
> Assim, se eu precisar filtrar "todas as apostas no Leão", fica muito mais fácil.

</details>


<details>
<summary><strong>❓ Explique o que é um "if/else" e dê um exemplo prático: validar se um jogador tem saldo suficiente para fazer uma aposta.</strong></summary>
<br>

> **Minha Resposta:**
>
> O `if/else` é a forma que eu tenho de ensinar o código a tomar decisões sozinho. É como se eu deixasse instruções: "Se acontecer X, faça isso. Senão, faça aquilo".
>
> 💻 **Validando o Saldo:**
> Eu implementaria uma proteção simples (Cláusula de Guarda):
> ```javascript
> const fazerAposta = (saldo, valor) => {
>   // Minha regra de ouro: Se não tem dinheiro, nem deixo o código continuar.
>   if (saldo < valor) {
>     throw new Error("Opa! Saldo insuficiente. Que tal recarregar?");
>   }
>   return true; // Se passou pelo if, tá liberado!
> }
> ```
> Gosto dessa abordagem porque ela falha rápido e poupa processamento.

</details>


<details>
<summary><strong>❓ O que acontece se você tentar dividir um número por zero em programação? Como você evitaria esse erro em um cálculo de probabilidade?</strong></summary>
<br>

> **Minha Resposta:**
>
> Na matemática isso não existe, e no código isso é pedir pra ter dor de cabeça. Pode travar o sistema ou gerar resultados bizarros como `Infinity`.
>
> 🛡️ **Como eu me previno:**
> Eu nunca confio que os dados vão vir certos. Antes de fazer a conta, eu checo:
> ```javascript
> function calcularChance(meusBilhetes, totalBilhetes) {
>   // Proteção: Se não tem bilhetes, a chance é zero e ponto final.
>   if (totalBilhetes === 0) return 0; 
>   
>   return (meusBilhetes / totalBilhetes) * 100;
> }
> ```
> É melhor prevenir com um `if` do que deixar o usuário ver um erro na tela.

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
