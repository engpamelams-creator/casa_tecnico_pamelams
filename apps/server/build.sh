#!/usr/bin/env bash
# Sair se der erro
set -o errexit

# 1. Instalar dependências
pip install -r requirements.txt

# 2. Entrar na pasta da API
cd api

# 3. Arrumar arquivos estáticos do Django (CSS do Admin)
python manage.py collectstatic --no-input

# 4. Rodar migrações no Banco de Dados
python manage.py migrate
