# 🚀 Deploy no GitHub Pages - E2E-Commerce

## 📋 Pré-requisitos

- Conta no GitHub
- Git instalado no seu computador
- Projeto E2E-Commerce funcionando localmente

## 🛠️ Passo a Passo para Deploy

### 1. Criar Repositório no GitHub

1. **Acesse** [GitHub.com](https://github.com) e faça login
2. **Clique** em "New repository" (botão verde)
3. **Configure o repositório**:
   - **Nome**: `e2e-commerce` (ou o nome que preferir)
   - **Descrição**: "Sistema completo de e-commerce com HTML, CSS e JavaScript"
   - **Visibilidade**: Public (para GitHub Pages gratuito)
   - **NÃO** marque "Add a README file" (já temos um)
4. **Clique** em "Create repository"

### 2. Configurar Git Local

Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit: E2E-Commerce system"

# Conectar com repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/e2e-commerce.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Pages

1. **Acesse** seu repositório no GitHub
2. **Vá** em "Settings" (aba superior)
3. **Role** até "Pages" (menu lateral esquerdo)
4. **Configure**:
   - **Source**: Deploy from a branch
   - **Branch**: main (ou master)
   - **Folder**: / (root)
5. **Clique** em "Save"

### 4. Aguardar Deploy

- O GitHub Pages levará alguns minutos para fazer o deploy
- Você receberá uma notificação quando estiver pronto
- A URL será: `https://SEU_USUARIO.github.io/e2e-commerce`

## 🔧 Configurações Avançadas

### Custom Domain (Opcional)

Se quiser usar um domínio próprio:

1. **Adicione** um arquivo `CNAME` na raiz do projeto:
   ```
   seu-dominio.com
   ```

2. **Configure** o DNS do seu domínio:
   ```
   CNAME www seu-usuario.github.io
   ```

### Configuração Automática

O projeto já inclui:
- ✅ **GitHub Actions** para deploy automático
- ✅ **Workflow** configurado em `.github/workflows/deploy.yml`
- ✅ **Gitignore** apropriado

## 📱 Testando o Deploy

### 1. Verificar Funcionamento
- Acesse a URL do GitHub Pages
- Teste todas as funcionalidades
- Verifique responsividade em diferentes dispositivos

### 2. Testar APIs
- **DummyJSON**: Deve funcionar normalmente
- **ViaCEP**: Pode ter limitações de CORS
- **LocalStorage**: Funciona normalmente

### 3. Problemas Comuns

#### CORS com APIs
Se houver problemas de CORS:
```javascript
// Adicionar no script.js se necessário
const corsProxy = 'https://cors-anywhere.herokuapp.com/';
```

#### Cache do Navegador
- Use Ctrl+F5 para forçar atualização
- Ou abra em aba anônima

## 🔄 Atualizações

Para atualizar o site:

```bash
# Fazer alterações nos arquivos
# ...

# Adicionar mudanças
git add .

# Commit com mensagem descritiva
git commit -m "Add new feature: [descrição]"

# Enviar para GitHub
git push origin main
```

O GitHub Pages atualizará automaticamente em alguns minutos.

## 📊 Monitoramento

### GitHub Actions
- Acesse a aba "Actions" no seu repositório
- Veja o status dos deploys
- Verifique logs em caso de erro

### Analytics (Opcional)
Para adicionar Google Analytics:

1. **Adicione** no `<head>` do `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 URLs Finais

Após o deploy, você terá:

- **Site Principal**: `https://SEU_USUARIO.github.io/e2e-commerce`
- **Demonstração**: `https://SEU_USUARIO.github.io/e2e-commerce/demo.html`
- **Repositório**: `https://github.com/SEU_USUARIO/e2e-commerce`

## 🚨 Troubleshooting

### Erro 404
- Verifique se o branch está correto
- Confirme se os arquivos estão na raiz
- Aguarde alguns minutos para propagação

### APIs não funcionam
- GitHub Pages serve apenas arquivos estáticos
- APIs externas podem ter limitações de CORS
- Use um proxy se necessário

### Layout quebrado
- Verifique se todos os arquivos CSS/JS estão incluídos
- Confirme caminhos relativos
- Teste em navegador local primeiro

## 📞 Suporte

### Recursos Úteis
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [CORS Issues](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### Comandos Úteis
```bash
# Ver status do Git
git status

# Ver histórico de commits
git log --oneline

# Ver branches
git branch -a

# Forçar push (cuidado!)
git push --force origin main
```

---

**E2E-Commerce** - Agora disponível globalmente! 🌍
