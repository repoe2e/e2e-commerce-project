#!/bin/bash

# E2E-Commerce - Deploy Script for GitHub Pages
# Este script automatiza o processo de deploy para o GitHub Pages

echo "🚀 Iniciando deploy do E2E-Commerce para GitHub Pages..."

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este não é um repositório Git. Execute 'git init' primeiro."
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adicionando arquivos modificados..."
    git add .
    
    echo "💾 Fazendo commit das mudanças..."
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✅ Nenhuma mudança detectada."
fi

# Verificar se existe remote origin
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Erro: Remote 'origin' não configurado."
    echo "Execute: git remote add origin https://github.com/SEU_USUARIO/e2e-commerce.git"
    exit 1
fi

# Fazer push para o GitHub
echo "📤 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Deploy realizado com sucesso!"
    echo "🌐 Seu site estará disponível em alguns minutos em:"
    echo "   https://$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Acesse seu repositório no GitHub"
    echo "   2. Vá em Settings > Pages"
    echo "   3. Configure Source como 'Deploy from a branch'"
    echo "   4. Selecione branch 'main' e folder '/'"
    echo "   5. Aguarde alguns minutos para o deploy"
else
    echo "❌ Erro no deploy. Verifique sua conexão e credenciais."
    exit 1
fi
