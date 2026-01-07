# 📘 Visão Geral e Decisões Técnicas

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d1117&height=200&section=header&text=Vis%C3%A3o%20Geral&fontSize=50&fontColor=ffffff&desc=Performance%20%7C%20Seguran%C3%A7a%20%7C%20Simplicidade&descAlignY=60&descAlign=50" width="100%" />
</div>

<br />

> **Status:** Pronto para Uso! 🚀
> **O que é:** Um sistema completo de Rifas com sorteio real, seguro e ao vivo.
> **Foco:** Ser rápido, confiável e fácil de entender.

---

## 🏗️ Como pensei na Arquitetura

Decidi organizar o projeto de um jeito que fosse organizado, mas sem complicar demais. Em vez de criar vários lugares diferentes para código, coloquei tudo junto num projeto só, mas bem separado por responsabilidade.

Basicamente, o sistema funciona em três partes que conversam entre si:

1.  **O que o usuário vê (Frontend):** A tela bonita onde as pessoas compram números.
2.  **O cérebro (Backend):** Onde ficam as regras de segurança e o sorteio.
3.  **O cofre (Banco de Dados):** Onde guardamos os bilhetes vendidos e os ganhadores.

---

## 🛠️ Tecnologias que escolhi (e o porquê)

### 1. Frontend: React + Vite
Escolhi o **React** porque é a tecnologia mais moderna hoje para criar telas que não travam. O **Vite** foi para deixar o projeto leve e rápido de rodar.
*   **O "Pulo do Gato":** Usei uma tecnologia de **Tempo Real** (WebSockets). Isso significa que, se você comprar o número 10 agora, ele fica vermelho na tela de todo mundo que estiver no site na mesma hora. Parece mágica, mas é tecnologia.

### 2. Backend: Python com Django
Para garantir que o sorteio seja sério, não confiei apenas no navegador. Mantive uma camada segura em **Python**. O **Django** é muito robusto e me ajuda a garantir que as regras sejam seguidas.
*   **Sem Confusão:** Usei um sistema de travas no banco de dados. Isso impede aquele erro chato de duas pessoas clicarem no mesmo número ao mesmo tempo e o sistema vender duplicado. Aqui, o primeiro leva e o segundo é avisado.

### 3. Banco de Dados: Supabase
Em vez de configurar servidores complexos do zero, usei o **Supabase**. Ele já me dá o banco de dados pronto e ainda cuida de toda a parte de Login (Autenticação), o que me poupou muito tempo para focar no que importa: a Rifa.

---

## 🛡️ O que torna esse projeto especial?

### 🔐 Acesso Híbrido (Público x Admin)
Fiz uma lógica interessante aqui:
1.  **Para todos:** A página principal é aberta. Qualquer pessoa pode entrar, ver os prêmios e participar.
2.  **Só para mim:** Criei uma área administrativa oculta. Quando eu faço login com minha senha, o sistema libera botões extras que só eu vejo (como o botão de "Resetar Rifa" ou ver o histórico financeiro).

### 🎲 Sorteio Honesto e Seguro
Muitos sistemas simples usam sorteios que dão para "adivinhar" se você souber a hora exata. Aqui não.
Usei uma biblioteca especial do Python chamada `secrets`. Ela usa a aleatoriedade do próprio sistema operacional para gerar o número vencedor. É matematicamente impossível prever o resultado. É justo de verdade.

---

## 📂 Como organizei as pastas

Tentei deixar tudo muito fácil de achar dentro da pasta `apps`:

*   📂 `apps/client`: Aqui fica todo o **Site** (React). Telas, cores, botões.
*   📂 `apps/server`: Aqui fica a **Lógica** (Python). As regras do sorteio.
*   📂 `infra`: Aqui ficam os arquivos de configuração do banco de dados.

---

## 🚀 Próximos Passos
Se eu fosse continuar melhorando esse projeto amanhã, eu faria:
1.  **Pagamento Real:** Integraria com o Pix para liberar o bilhete só depois do pagamento.
2.  **Gráficos:** Colocaria um gráfico para ver quais dias vendemos mais.
3.  **Chat:** Talvez um chat para as pessoas conversarem durante o sorteio.

<br />

<div align="center">
  <sub>Desenvolvido com carinho por <strong>Pamela M.S</strong></sub>
</div>
