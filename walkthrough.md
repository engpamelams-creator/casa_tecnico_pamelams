# 🏆 Rifa Real - Project Walkthrough

O **Rifa Real** é uma plataforma de gestão de sorteios "Enterprise-Grade", estruturada como um Monorepo Modular.

## ✨ Principais Funcionalidades

### 1. 🌍 Multiplayer em Tempo Real (Supabase)
Sincronização instantânea via WebSockets.
*   **Live Sync:** Bloqueio de bilhetes em tempo real.
*   **Event-Driven:** O frontend reage a eventos do banco de dados.

### 2. 🔐 Autenticação Híbrida
*   **Acesso Público:** High Availability para usuários finais.
*   **Admin Seguro:** Área protegida para gestão (TechLead Access).

### 3. 🛡️ Backend & Infra
*   **Django API:** Proteção contra Race Conditions (`select_for_update`).
*   **Modular Architecture:** Código organizado em `apps/client` e `apps/server`.

![Login Screen](/login_page_view_1767813599824.png)

---

## 🚀 Como Rodar Localmente

### Frontend (Client)
```bash
cd apps/client
npm install
npm run dev
```
Acesse: `http://localhost:5173`

### Backend (Server)
```bash
cd apps/server/api
python manage.py runserver
```

---

## ☁️ Deployment (Render)

Preparamos o projeto para deploy automático no **Render**.
👉 **[Veja o Guia de Deploy (DEPLOY.md)](./DEPLOY.md)** para colocar o sistema no ar em 5 minutos.

---

## 📂 Estrutura do Monorepo

| Pasta | Descrição |
| :--- | :--- |
| `apps/client` | Frontend React + Vite (Modularizado). |
| `apps/server` | Backend Python + Django + Scripts de Build. |
| `infra` | Configurações de Banco de Dados. |
