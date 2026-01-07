# 📘 Technical Blueprint & Project Specifications

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d1117&height=200&section=header&text=Architectural%20Overview&fontSize=50&fontColor=ffffff&desc=Performance%20%7C%20Security%20%7C%20Scalability&descAlignY=60&descAlign=50" width="100%" />
</div>

<br />

> **Project Status:** Production Ready (MVP) 🚀
> **Architecture:** Modular Monolith with Microservices potential
> **Core Focus:** Data Integrity, Cryptographic Security, and High-Performance UI.

---

## 🏗️ Architectural Design (High Level)

Este projeto foi concebido seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, garantindo desacoplamento entre camadas de interface, lógica de negócios e segurança.

```mermaid
graph TD
    User((User Interaction)) --> |HTTPS/WSS| Frontend[React Client (Vite/Tailwind)]
    Frontend --> |Async Requests| CoreLayer{Core Logic Layer}
    
    subgraph "Core Logic (Node.js)"
        CoreLayer --> |Singleton| RifaService[Rifa Service State]
        RifaService --> |Mutex Lock| Concurrency[Concurrency Controller]
        RifaService --> |CSPRNG| Crypto[Node.js Crypto Module]
    end
    
    subgraph "Backend Logic (Python)"
        PyScript[Data Processing Scripts] --> |Type Safety| DataClasses[Strict Data Models]
        PyScript --> |Secrets Module| PyCrypto[Python Secrets CSPRNG]
    end
```

---

## 🛠️ Technology Stack & Decision Records (ADRs)

### 1. Frontend: High-Performance React
*   **Engine:** `Vite` (ESBuild) para bundling instantâneo e Hot Module Replacement (HMR).
*   **UI/UX:** `Framer Motion` para orquestração de animações baseadas em física (Spring Physics), garantindo fluidez 60fps.
*   **Styling:** `Tailwind CSS v3` (JIT Compiler) para design system atômico e redução de bundle size.
*   **State Management:** React Hooks (`useState`, `useEffect`) com otimização de re-render via segregação de componentes.

### 2. Core Logic: Security First Principle
*   **Runtime:** `Node.js` runtime para execução assíncrona non-blocking I/O.
*   **Algorithm:** Implementação de **Singleton Pattern** para garantir "Single Source of Truth" do estado da rifa.
*   **Data Structures:** Utilização de `Set` (Hash Map) para lookup de bilhetes vendidos em **O(1)** (tempo constante), superior a arrays O(n).

---

## 🛡️ Engineering Differentiators (Deep Dive)

### 🔐 Cryptographically Secure PRNG (CSPRNG)
Diferente de implementações simples que utilizam `Math.random()` (baseado em timestamp e previsível), este projeto utiliza fontes de entropia do sistema operacional.
*   **JS:** `crypto.randomInt()` - Garante distribuição uniforme e imprevisibilidade.
*   **Python:** `secrets` module - Segurança de nível militar para geração de tokens e sorteios.

### 🚦 Concurrency & Race Conditions
Para mitigar o problema do "Double Spending" (dois usuários comprando o mesmo bilhete no mesmo milissegundo), implementei uma simulação de **Mutex (Mutual Exclusion)**.
> *O sistema "trava" (Locks) o recurso crítico durante a transação de compra, forçando requisições concorrentes a aguardarem (Await Queue) até a liberação do estado, garantindo Atomicidade (ACID).*

---

## 🎯 Quality Assurance (QA) & Testing Strategy

A confiabilidade é assegurada por uma suíte de testes automatizados multi-linguagem, cobrindo Unit Tests e Integration Scenarios.

### 🧪 Javascript Testing (Jest Framework)
Foco na validação comportamental e de estado.
*   **Concurrency Stress Test:** Simulação de múltiplas chamadas assíncronas simultâneas.
*   **Boundary Testing:** Testes de limites (Ex: comprar bilhete 0, bilhete N+1).
*   **State Reset:** Garantia de limpeza de memória entre suítes de teste.

### 🐍 Python Testing (Pytest)
Foco na integridade lógica e tipagem.
*   **Type Checking:** Validação rigorosa de tipos com `dataclasses`.
*   **Security Audit:** Verificação da geração de chaves.

**Para executar a suíte de testes:**
```bash
# Executa a suíte frontend/core (Relatório detalhado)
npx jest --verbose

# Executa a suíte de backend logic
python -m pytest
```

---

## 📂 Project Directory Structure

```bash
📦 Teste_Tecnico_Pamela_Menezes
 ┣ 📂 src
 ┃ ┣ 📂 Rifa_Real             # Frontend Moderno (SPA)
 ┃ ┃ ┣ 📂 src
 ┃ ┃ ┃ ┣ 📜 App.jsx          # Reactive Logic & Animations
 ┃ ┃ ┃ ┗ 📜 main.jsx         # DOM Entry Point
 ┃ ┃ ┗ 📜 package.json       # Dependency Tree
 ┃ ┣ 📂 javascript            # Node.js Core Logic
 ┃ ┃ ┗ 📜 desafio_rifa.js    # Singleton Service
 ┃ ┗ 📂 python_scripts        # Python Backend Logic
 ┃ ┃ ┗ 📜 solucao_logica.py  # Typed Implementation
 ┣ 📂 tests                   # QA Automation Suite
 ┃ ┣ 📜 rifa.test.js         # Jest Scenarios
 ┃ ┗ 📜 test_rifa.py         # Pytest Scenarios
 ┣ 📜 INFO_PROJETOS.md        # Technical Documentation
 ┗ 📜 README.md               # Executive Summary
```

---

## 🚀 Scalability Roadmap

1.  **Containerization:** Dockerfile para isolamento de ambiente (Node 20-alpine).
2.  **API Migration:** Expor as funções core via **FastAPI** (Python) ou **Express** (Node) para arquitetura Client-Server real.
3.  **Persistência:** Migrar do estado em memória para **PostgreSQL** ou **Redis** (para gestão de Locks distribuídos).

<br />

<div align="center">
  <sub>Engineered by <strong>Dev Pamela M.S</strong></sub>
</div>
