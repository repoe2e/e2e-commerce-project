# ⚡ Deploy Rápido - GitHub Pages

## 🚀 Deploy em 5 Minutos

### 1. Criar Repositório no GitHub
```bash
# 1. Acesse github.com e crie um novo repositório público
# 2. Nome: e2e-commerce
# 3. NÃO marque "Add README"
```

### 2. Configurar Git e Fazer Upload
```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit: E2E-Commerce"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/e2e-commerce.git
git push -u origin main
```

### 3. Ativar GitHub Pages
```bash
# 1. Acesse seu repositório no GitHub
# 2. Settings > Pages
# 3. Source: Deploy from a branch
# 4. Branch: main, Folder: / (root)
# 5. Save
```

### 4. Aguardar e Acessar
```bash
# URL será: https://SEU_USUARIO.github.io/e2e-commerce
# Aguarde 2-5 minutos para o deploy
```

## 🔧 Script Automatizado

Use o script de deploy incluído:

```bash
# Windows (PowerShell)
.\deploy.sh

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

## 📱 Teste Rápido

1. **Acesse**: `https://SEU_USUARIO.github.io/e2e-commerce`
2. **Login**: `emilys` / `emilyspass`
3. **Teste**: Adicione produtos, finalize compra
4. **Mobile**: Teste responsividade

## ✅ Checklist de Deploy

- [ ] Repositório público criado
- [ ] Arquivos enviados para GitHub
- [ ] GitHub Pages ativado
- [ ] Site acessível via URL
- [ ] Funcionalidades testadas
- [ ] Responsividade verificada

## 🆘 Problemas Comuns

### Erro 404
- Verifique se o branch está correto
- Confirme se GitHub Pages está ativado
- Aguarde alguns minutos

### APIs não funcionam
- GitHub Pages pode ter limitações de CORS
- Teste localmente primeiro
- Use proxy se necessário

### Layout quebrado
- Verifique se todos os arquivos estão na raiz
- Confirme caminhos relativos
- Limpe cache do navegador

---

**Deploy realizado com sucesso!** 🎉
