# 🚀 Guia de Deploy: Rifa Real no Render

Este guia ensina como colocar sua aplicação Full Stack online usando o **Render**.

## FASE 1: Preparação (Já Realizada) ✅
O código já está configurado com:
*   `build.sh` no backend.
*   `requirements.txt` atualizado.
*   `settings.py` com suporte a CORS e Banco de Dados.
*   Alterações enviadas para o GitHub.

---

## FASE 2: Subir o Backend (Web Service) 🐍
1.  Acesse o [Render Dashboard](https://dashboard.render.com/).
2.  Clique em **New +** -> **Web Service**.
3.  Conecte seu repositório GitHub (`Teste_Tecnico_Pamela_Menezes`).

**Configurações:**
*   **Name:** `rifa-backend`
*   **Root Directory:** `apps/server` ⚠️ (Essencial)
*   **Runtime:** `Python 3`
*   **Build Command:** `./build.sh`
*   **Start Command:** `cd api && gunicorn setup_rifa.wsgi:application`

**Environment Variables (Variáveis de Ambiente):**
1.  `DATABASE_URL`: **IMPORTANTE:** Use a conexão IPv4 (Supavisor) para o Render funcionar.
    *   Formato: `postgresql://[USER].[PROJECT_REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`
    *   **Sua URL Pronta:** `postgresql://postgres.uqzkxtemxnwcoxswptaa:JasperSpencer1234%40@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`
2.  `SECRET_KEY`: (Gere uma chave aleatória)
3.  `PYTHON_VERSION`: `3.9.0`
4.  `RENDER`: `true`

Clique em **Create Web Service**. 
⏳ **Aguarde ficar "Live"** e copie a URL gerada (ex: `https://rifa-backend.onrender.com`).

---

## FASE 3: Subir o Frontend (Static Site) ⚛️
1.  No Render, clique em **New +** -> **Static Site**.
2.  Conecte o mesmo repositório.

**Configurações:**
*   **Name:** `rifa-frontend`
*   **Root Directory:** `apps/client` ⚠️ (Essencial)
*   **Build Command:** `npm install && npm run build`
*   **Publish Directory:** `dist`

**Environment Variables:**
1.  `VITE_API_URL`: `https://rifa-backend.onrender.com` (Sua URL do backend, sem a barra `/` final).
2.  `VITE_SUPABASE_URL`: (Sua URL do Supabase)
3.  `VITE_SUPABASE_ANON_KEY`: (Sua chave pública do Supabase)

Clique em **Create Static Site**.

---

## ✅ Resolução de Problemas
*   **Erro na Build do Backend?** Verifique se o `Root Directory` está exatamente como `apps/server`.
*   **Frontend não carrega rifas?** Verifique se a variável `VITE_SUPABASE_URL` está correta no Render.
*   **Erro de CORS?** O backend já está configurado para aceitar `*` (All Origins). Verifique se o deploy do backend terminou.
