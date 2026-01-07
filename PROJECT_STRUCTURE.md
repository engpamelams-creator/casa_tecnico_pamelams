# 🏗️ Estrutura do Projeto Royal Rifa

Este documento detalha a arquitetura do monorepo híbrido, facilitando a navegação e o entendimento por novos desenvolvedores.

## 📂 Visão Geral de Diretórios

```
Teste_Tecnico_Pamela_Menezes/
├── .github/              # 🤖 Configurações de CI/CD (GitHub Actions)
├── apps/
│   ├── client/           # 🎨 Frontend (React + Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── modules/  # 📦 Módulos de funcionalidade (Rifa, Auth)
│   │   │   ├── shared/   # 🤝 Componentes e Hooks reutilizáveis
│   │   │   │   ├── components/ # (UI Kits, Botões, Modais)
│   │   │   │   ├── context/    # (Estado Global: Temas, Conquistas)
│   │   │   │   └── hooks/      # (Lógica: useAudio, useSpeech)
│   │   │   └── core/     # ⚙️ Configurações base (Supabase, Rotas)
│   │   └── tests/        # 🧪 Testes Unitários de Frontend
│   │
│   └── server/           # 🧠 Backend (Python/Django ou Scripts Auxiliares)
│       └── api/          # 🔌 Endpoints e Lógica de Negócio Sever-side
│
├── tests/                # 🧪 Testes de Integração e E2E
└── documentacao/         # 📚 Manuais e Guias de Deploy
```

## 🚀 Diferenciais de Arquitetura

1.  **Monorepo Híbrido**: Mantém frontend e backend no mesmo versionamento, facilitando a sincronia de features e deploys atômicos.
2.  **Design Atômico (Adaptado)**: Componentes organizados por escopo (`shared` vs `modules`), promovendo reutilização sem "over-engineering".
3.  **State Management Híbrido**:
    *   **Context API**: Para estados globais leves (Temas, Gamificação).
    *   **Supabase Realtime**: Para estado crítico sincronizado (Venda de Bilhetes).
    *   **Local Storage**: Para persistência de preferências do usuário.
4.  **Segurança CSPRNG**: Utilização de `window.crypto` para geração de entropia em sorteios, garantindo justiça criptográfica.

## 🛠️ Stack Tecnológica

*   **Frontend**: React 18, Framer Motion (Animações), TailwindCSS (Estilo), Lucide (Ícones).
*   **Backend/BaaS**: Supabase (PostgreSQL + Realtime + Auth).
*   **Qualidade**: Vitest/Jest (Testes), ESLint (Linting), GitHub Actions (CI).

---
*Documento gerado automaticamente para garantir conformidade com padrões de qualidade nível 10.*
