# 📘 Technical Blueprint & Project Specifications

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d1117&height=200&section=header&text=Architectural%20Overview&fontSize=50&fontColor=ffffff&desc=Performance%20%7C%20Security%20%7C%20Scalability&descAlignY=60&descAlign=50" width="100%" />
</div>

<br />

> **Project Status:** Production Ready (Enterprise Grade) 🚀
> **Architecture:** Modular Monorepo (Nest.js Style)
> **Core Focus:** Data Integrity, Hybrid Access Control, and Real-Time Synchronization.

---

## 🏗️ Architectural Design (High Level)

Este projeto evoluiu para uma arquitetura de **Modular Monorepo**, inspirada em frameworks corporativos como Nest.js e Nx. Isso garante que o crescimento do software seja sustentável, com clara separação entre domínios.

```mermaid
graph TD
    User((User Interaction)) --> |HTTPS/WSS| ClientApp[React Client (Apps/Client)]
    ClientApp --> |Realtime Sync| SupabaseDB[(Supabase Postgres)]
    ClientApp --> |Auth| SupabaseAuth[Supabase Auth]
    
    subgraph "Frontend Architecture (Modular)"
        ClientApp --> CoreModule[Core Module]
        ClientApp --> AuthModule[Auth Module]
        ClientApp --> RifaModule[Rifa Module]
        ClientApp --> SharedModule[Shared UI/Hooks]
    end

    subgraph "Backend Architecture (Django)"
        DjangoAPI[Django Rest Framework] --> |Concurrency Control| DB_Lock[Row Level Locking]
        DjangoAPI --> |Audit| AuditLog[Audit Logs]
    end
```

---

## 🛠️ Technology Stack & Decision Records (ADRs)

### 1. Frontend: Modular React (Nest.js Style)
*   **Structure:** `apps/client` organizado em módulos (`auth`, `rifa`, `shared`, `core`).
*   **Engine:** `Vite` (ESBuild) para bundling instantâneo.
*   **UI Library:** `Framer Motion` + `Tailwind CSS v3` (JIT) para interfaces fluidas e performáticas.
*   **Real-time:** `Supabase Realtime` (WebSockets) para sincronização instantânea de estado entre múltiplos clientes (Multiplayer).

### 2. Backend: Django Enterprise Layer
*   **Framework:** `Django` + `Django REST Framework` (DRF).
*   **Security:** `transaction.atomic` e `select_for_update` para garantir consistência em ambientes de alta concorrência.
*   **Docs:** `Swagger/Redoc` (drf-yasg) para documentação automática de API.

### 3. Database & Auth: Supabase (PostgreSQL)
*   **Auth:** Integração nativa com Supabase Auth para gestão de sessões seguras.
*   **RLS (Row Level Security):** Políticas de segurança a nível de banco de dados para proteger dados sensíveis.

---

## 🛡️ Engineering Differentiators (Deep Dive)

### 🔐 Hybrid Access Control (RBAC Lite)
Implementamos um sistema de acesso híbrido sofisticado:
1.  **Public Layer:** Acesso irrestrito para visualização e compra (High Availability).
2.  **Protected Layer:** Painel Administrativo acessível apenas via autenticação segura. O sistema verifica a sessão e libera funcionalidades críticas (Reset, Dashboard Financeiro) dinamicamente.

### 🚦 Concurrency & Race Conditions
Para mitigar o problema do "Double Spending" (dois usuários comprando o mesmo bilhete no mesmo milissegundo):
*   **Frontend:** Otimistic Updates com rollback em caso de falha.
*   **Backend:** Locks de banco de dados (`FOR UPDATE`) garantem que apenas uma transação modifique o estado do bilhete por vez.

### 🎲 Cryptographically Secure PRNG (CSPRNG)
Sorteios não utilizam `Math.random()` inseguro.
*   **Python:** Módulo `secrets` para entropia do sistema operacional, invulnerável a ataques de predição.

---

## 🎯 Quality Assurance (QA) & Testing Strategy

A confiabilidade é assegurada por testes automatizados em ambas as pontas do sistema.

### 🧪 Frontend & Integration (Jest)
*   **Realtime Simulation:** Testes que validam a chegada de eventos WebSocket.
*   **Component Isolation:** Testes unitários dos módulos `auth` e `rifa` de forma isolada.

### 🐍 Backend Logic (Pytest)
*   **Transaction Integrity:** Testes que tentam forçar Race Conditions para validar os Locks.
*   **Security Audit:** Verificação da geração de chaves e integridade dos dados.

---

## 📂 Project Directory Structure (Monorepo)

A estrutura foi refatorada para suportar escala infinita:

```bash
📦 Teste_Tecnico_Pamela_Menezes
 ┣ 📂 apps                      # Application Layer
 ┃ ┣ 📂 client                  # React Frontend
 ┃ ┃ ┣ 📂 src
 ┃ ┃ ┃ ┣ 📂 modules             # Feature Modules (Domain functionality)
 ┃ ┃ ┃ ┃ ┣ 📂 auth              # Login & Security
 ┃ ┃ ┃ ┃ ┗ 📂 rifa              # Core Business Logic
 ┃ ┃ ┃ ┣ 📂 shared              # Reusable Components & Hooks
 ┃ ┃ ┃ ┗ 📂 core                # Global Configuration (Supabase)
 ┃ ┗ 📂 server                  # Python Backend Logic
 ┃ ┃ ┣ 📂 api                   # Django Project
 ┃ ┃ ┗ 📂 scripts               # Standalone Scripts
 ┣ 📂 infra                     # Infrastructure Layer
 ┃ ┗ 📂 database                # SQL Scripts & Migrations
 ┣ 📂 tests                     # QA Automation Suite
 ┣ 📜 INFO_PROJETOS.md          # Technical Documentation
 ┗ 📜 README.md                 # Executive Summary
```

---

## 🚀 Scalability Roadmap

1.  **Microservices:** Extrair o módulo de autenticação para um serviço isolado.
2.  **CI/CD:** Pipelines no GitHub Actions para deploy automático no Netlify (Front) e Railway (Back).
3.  **Analytics:** Integração com PostHog para monitoramento de comportamento do usuário.

<br />

<div align="center">
  <sub>Engineered by <strong>Dev Pamela M.S</strong></sub>
</div>
