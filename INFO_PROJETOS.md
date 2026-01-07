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

Decidi organizar o projeto de um jeito que permitisse duas formas de rodar: **Simples** (só Frontend) ou **Completa** (com Backend Python).

O projeto é um **Monorepo**, o que significa que colei Frontend e Backend na mesma casa, mas em quartos separados. Isso facilita para quem vai analisar o código ver tudo de uma vez.

1.  **O que o usuário vê (Frontend):** A tela bonita onde as pessoas compram números.
2.  **O cérebro (Backend):** O código Python robusto que serve como auditoria e "fonte da verdade".
3.  **O cofre (Banco de Dados):** Onde guardamos os bilhetes vendidos e os ganhadores.

---

## 🛠️ Tecnologias que escolhi (e o porquê)

### 1. Frontend: React + Vite
Escolhi o **React** porque é a tecnologia padrão de mercado. O **Vite** garante que o projeto rode rápido em qualquer máquina.
*   **Interatividade:** Usei uma tecnologia de **Tempo Real** (WebSockets). Sabe quando alguém compra um bilhete e ele fica bloqueado pra todos na hora? É isso.
*   **Segurança no Navegador:** Para o modo "Serverless", implementei o sorteio usando `window.crypto`. É muito mais seguro que o `Math.random` comum e garante que o sorteio seja justo mesmo sem o servidor Python ligado.

### 2. Backend: Python com Django
Mantive uma estrutura completa em Python na pasta `apps/server`.
*   **Por que ele está lá?** Mesmo que o Frontend consiga rodar sozinho hoje, deixei o Backend pronto para mostrar que sei construir APIs robustas. Ele tem travas de banco de dados (`select_for_update`) para evitar erros em grandes escalas.
*   **Flexibilidade:** O recrutador pode ver que pensei tanto na solução rápida (Frontend Only) quanto na solução corporativa (Backend Django).

### 3. Banco de Dados: Supabase
Em vez de configurar servidores complexos do zero, usei o **Supabase**. Ele entrega um banco PostgreSQL pronto e seguro, além de cuidar do Login dos administradores.

---

## 🛡️ O que torna esse projeto especial?

### 🔐 Acesso Híbrido (Público x Admin)
Fiz uma lógica interessante aqui:
1.  **Público:** Aberto para compras.
2.  **Admin:** Protegido por senha. Só o administrador vê os botões de "Resetar" e o painel financeiro.

### 🎲 Sorteio Honesto (Criptografia)
Usei criptografia de ponta a ponta. Seja rodando no Frontend ou no Backend, o sistema usa fontes de entropia segura (não dá pra adivinhar o próximo número).

---

## 📂 Como organizei as pastas

*   📂 `apps/client`: Aqui fica todo o **Site** (React).
*   📂 `apps/server`: Aqui fica a **Lógica Python** (Django).
*   📂 `render.yaml`: Arquivo que ensina o servidor de deploy a subir tudo sozinho.

---

## 🚀 Próximos Passos
Se eu fosse continuar melhorando esse projeto amanhã, eu faria:
1.  **Pagamento Real:** Integraria com o Pix.
2.  **Testes E2E:** Criaria robôs para testar a compra de bilhetes automaticamente.

<br />

<div align="center">
  <sub>Desenvolvido com carinho por <strong>Pamela M.S</strong></sub>
</div>
