# 🎓 Guia Técnico para Entrevista (Interview Cheat Sheet)

Este documento explica os conceitos avançados aplicados no seu projeto para que você possa defendê-los com confiança na entrevista técnica.

---

## 🔐 1. O que é CSPRNG? (Segurança)

**Pergunta do Entrevistador:** *"Por que você usou `crypto` ou `secrets` em vez de `Math.random()`?"*

**Sua Resposta:**
> "Para garantir a integridade do sorteio. O `Math.random()` utiliza um PRNG (Pseudo-Random Number Generator) simples, que é determinístico e previsível se alguém descobrir a 'seed' (semente) inicial. Em um sistema valendo prêmios, isso é uma vulnerabilidade grave.
>
> Eu utilizei um **CSPRNG** (Cryptographically Secure PRNG). Ele busca entropia do sistema operacional (como ruído de hardware, movimentos do mouse, tráfego de rede) para gerar números verdadeiramente imprevisíveis, garantindo que o sorteio seja auditável e à prova de ataques de predição."

---

## 🏁 2. Race Conditions & Mutex (Concorrência)

**Pergunta do Entrevistador:** *"Como você garante que o mesmo número não seja vendido duas vezes se mil pessoas clicarem ao mesmo tempo?"*

**Sua Resposta:**
> "Isso é um problema clássico de **Race Condition** (Condição de Corrida). Se duas requisições lerem o banco de dados ao mesmo tempo, ambas verão o bilhete como 'disponível' e tentarão vender.
>
> Para resolver isso, implementei um padrão de **Mutex (Mutual Exclusion)** ou Lock.
>
> 1.  Quando uma venda inicia, o sistema 'tranca' o acesso àquele recurso.
> 2.  Se outra requisição chegar, ela entra numa fila de espera (await).
> 3.  Só liberamos o 'tranco' após a venda ser finalizada (commit) ou falhar.
>
> Em sistemas menores node.js, podemos fazer isso em memória (como fiz no código). Em sistemas distribuídos maiores, eu usaria um **Redlock (Redis)** ou transações de banco de dados (`SELECT ... FOR UPDATE`)."

---

## 🏗️ 3. Singleton Pattern (Design Patterns)

**Pergunta do Entrevistador:** *"Por que a classe RifaService é um Singleton?"*

**Sua Resposta:**
> "Porque a rifa tem um **Estado Global** (a lista de bilhetes vendidos) que precisa ser consistente em toda a aplicação.
>
> Se eu criasse uma nova instância de `RifaService` a cada requisição (`new RifaService()`), cada usuário estaria comprando bilhetes em rifas diferentes e vazias. O Singleton garante que existe **uma única instância** da rifa na memória, compartilhada por todos os usuários, mantendo a integridade dos dados vendidos."

---

## 🧪 4. Por que Dataclasses no Python?

**Pergunta do Entrevistador:** *"Por que usar `@dataclass` em vez de dicionários comuns?"*

**Sua Resposta:**
> "Para Type Safety e Legibilidade. Dicionários são flexíveis, mas propensos a erro humano (digitar chave errada).
>
> Com `dataclasses`, definimos uma estrutura rígida para o `Bilhete`. Isso permite que a IDE (VS Code) me ajude com autocomplete, valida tipos automaticamente e consome menos memória que objetos normais. É uma prática de Python Moderno (versão 3.7+) essencial para projetos escaláveis."

---

<div align="center">
  <sub>Estude esses pontos e boa sorte! 🚀</sub>
</div>
