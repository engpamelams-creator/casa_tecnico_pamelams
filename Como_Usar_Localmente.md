# 🚀 Como Usar o Projeto Localmente

Este guia mostra como rodar o **Royal Rifa** no seu computador.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **Git** - [Download aqui](https://git-scm.com/)
- **Editor de Código** (recomendado: VS Code)

---

## 🔧 Passo 1: Clonar o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/seu-usuario/Teste_Tecnico_Pamela_Menezes.git
cd Teste_Tecnico_Pamela_Menezes
```

---

## ⚙️ Passo 2: Configurar Variáveis de Ambiente

### Frontend (React)

1. Navegue até a pasta do cliente:
   ```bash
   cd apps/client
   ```

2. Crie um arquivo `.env` com as credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

> **💡 Dica:** Se você não tem um projeto Supabase, crie um gratuitamente em [supabase.com](https://supabase.com)

---

## 📦 Passo 3: Instalar Dependências

Ainda dentro de `apps/client`, execute:

```bash
npm install
```

Isso vai instalar todas as bibliotecas necessárias (React, Vite, Tailwind, Supabase, etc).

---

## 🗄️ Passo 4: Configurar o Banco de Dados (Supabase)

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `infra/database/database_setup.sql`
4. Execute o script para criar as tabelas (`bilhetes`, `historico_vencedores`)

---

## ▶️ Passo 5: Iniciar o Servidor de Desenvolvimento

Execute o comando:

```bash
npm run dev
```

Você verá algo assim:

```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Passo 6: Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173/
```

Pronto! O **Royal Rifa** está rodando localmente. 🎉

---

## 🔐 Passo 7: Fazer Login (Admin)

Para acessar as funcionalidades de administrador:

1. Clique em **"Área Restrita"** no canto superior direito
2. Use as credenciais configuradas no Supabase Authentication
3. Após login, você verá:
   - Botão de **Engrenagem** (Configurações)
   - Botão de **Admin** (Histórico de Sorteios)
   - Botão de **Novo Sorteio** (Reset)

---

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria a versão de produção |
| `npm run preview` | Visualiza a build de produção |

---

## 🐛 Problemas Comuns

### ❌ Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

### ❌ Erro: "Supabase connection failed"
**Solução:** Verifique se as variáveis de ambiente no `.env` estão corretas

### ❌ Porta 5173 já está em uso
**Solução:** Feche outros projetos Vite ou use `npm run dev -- --port 3000`

---

## 📚 Estrutura do Projeto

```
Teste_Tecnico_Pamela_Menezes/
├── apps/
│   ├── client/          # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── modules/rifa/   # Componente principal
│   │   │   ├── core/           # Supabase client
│   │   │   └── shared/         # Hooks e utilitários
│   │   └── .env         # Variáveis de ambiente
│   └── server/          # Backend Django (opcional)
├── infra/
│   └── database/        # Scripts SQL
└── README.md
```

---

## 🎯 Próximos Passos

- Explore o código em `apps/client/src/modules/rifa/RifaDashboard.jsx`
- Personalize as cores e animações em `apps/client/src/index.css`
- Adicione novos recursos (ex: pagamento, notificações)

---

## 💬 Suporte

Dúvidas? Entre em contato:
- **Email:** devpamela@gmail.com 

---

**Desenvolvido com ❤️ por Pamela Menezes**
