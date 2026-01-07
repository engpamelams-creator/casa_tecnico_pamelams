# 🏆 Rifa Real - Project Walkthrough

O **Rifa Real** é um sistema moderno de gestão de sorteios.
Ele opera em modo híbrido: pode rodar **100% Serverless** (apenas Frontend) ou **Full Stack** (com Django).

## ✨ Principais Funcionalidades

### 1. 🌍 Multiplayer em Tempo Real (Supabase)
*   **Live Sync:** O frontend conecta diretamente ao banco de dados via WebSockets.
*   **Serverless Crypto:** O sorteio usa `window.crypto` (segurança militar) rodando direto no navegador, sem precisar de backend.

### 2. 🔐 Autenticação & Admin
*   **Acesso Público:** Aberto para todos comprarem.
*   **Admin Seguro:** Área protegida para resetar sorteios e ver ganhadores.

### 3. 🛡️ Backend & Infra (Architecture Demo)
Mantivemos o código Python (`apps/server`) no repositório para demonstrar arquitetura robusta:
*   **Django API:** Proteção contra Race Conditions (`select_for_update`).
*   **Monorepo:** Organização profissional de pastas.

![Login Screen](/login_page_view_1767813599824.png)

---

## 🚀 Como Rodar Localmente

### Opção A: Apenas Frontend (Rápido)
```bash
cd apps/client
npm install
npm run dev
```
O sistema funcionará 100% (Sorteio, Login, Realtime).

### Opção B: Backend Django (Opcional)
```bash
cd apps/server/api
python manage.py runserver
```

---

## ☁️ Deployment (Render ou Netlify)

O projeto é "Cloud Agnostic". Você pode escolher:
*   **Render:** Ótimo para Full Stack (Backend + Frontend).
*   **Netlify:** Perfeito para o modo Serverless (Só Frontend).

👉 **[Veja o Guia de Deploy (DEPLOY.md)](./DEPLOY.md)**.

---

## 📂 Estrutura do Monorepo

| Pasta | Descrição |
| :--- | :--- |
| `apps/client` | Frontend React + Vite (Logica de Sorteio Serverless). |
| `apps/server` | Backend Python + Django (Demonstração de Arquitetura). |
| `render.yaml` | Infraestrutura Render. |
| `netlify.toml` | Infraestrutura Netlify. |
