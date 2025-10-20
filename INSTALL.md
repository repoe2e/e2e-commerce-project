# 🚀 Instalação e Execução - E2E-Commerce

## 📋 Pré-requisitos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Conexão com internet** (para APIs externas)
- **Node.js** (opcional, para servidor local)

## 🛠️ Métodos de Instalação

### Método 1: Execução Direta (Recomendado)

1. **Baixe os arquivos** do projeto
2. **Abra o arquivo** `demo.html` em seu navegador
3. **Clique em "Iniciar Demonstração"** para acessar o sistema

### Método 2: Servidor Local (Desenvolvimento)

1. **Instale o Node.js** (se não tiver)
   ```bash
   # Verificar se Node.js está instalado
   node --version
   npm --version
   ```

2. **Instale as dependências** (opcional)
   ```bash
   npm install
   ```

3. **Execute o servidor local**
   ```bash
   # Método 1: Usando npm script
   npm run dev
   
   # Método 2: Usando http-server
   npm start
   
   # Método 3: Usando live-server
   npx live-server --port=3000 --open=/demo.html
   ```

4. **Acesse** `http://localhost:3000` no navegador

## 🌐 URLs de Acesso

- **Demonstração**: `demo.html`
- **Sistema Principal**: `index.html`
- **Servidor Local**: `http://localhost:3000`

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
# APIs Externas
DUMMYJSON_API_URL=https://dummyjson.com
VIACEP_API_URL=https://viacep.com.br/ws

# Configurações do Sistema
SESSION_TIMEOUT=1800000
MAX_ADDRESSES=3
FREE_SHIPPING_THRESHOLD=399
INTEREST_RATE=0.01
```

### Estrutura de Arquivos

```
e2e-commerce/
├── index.html          # Página principal do sistema
├── demo.html           # Página de demonstração
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── README.md           # Documentação principal
├── INSTALL.md          # Instruções de instalação
├── package.json        # Configurações do projeto
└── .env               # Variáveis de ambiente (opcional)
```

## 🧪 Testando o Sistema

### 1. Teste de Autenticação
- Use as credenciais: `emilys` / `emilyspass`
- Ou crie uma nova conta com validações

### 2. Teste de Produtos
- Navegue pelo catálogo
- Use os filtros e busca
- Adicione produtos ao carrinho

### 3. Teste de Pagamento
- Use os cartões de teste fornecidos
- Teste PIX, crédito e débito
- Verifique cálculos de parcelamento

### 4. Teste de Endereços
- Adicione endereços (máximo 3)
- Teste integração com ViaCEP
- Use diferentes tipos de endereço

## 🐛 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, use um servidor local:
```bash
npx http-server . -p 3000 --cors
```

### APIs Indisponíveis
- DummyJSON: Use dados mockados locais
- ViaCEP: Preenchimento manual de endereços

### Problemas de Cache
Limpe o cache do navegador:
- **Chrome**: Ctrl+Shift+R
- **Firefox**: Ctrl+F5
- **Safari**: Cmd+Shift+R

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos
- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Mobile (até 767px)

## 🔒 Segurança

### Dados Sensíveis
- Senhas são "criptografadas" (simulação)
- Dados de cartão são mascarados
- Sessão expira automaticamente

### APIs Externas
- DummyJSON: Dados públicos de teste
- ViaCEP: Consulta pública de CEPs
- Nenhum dado real é enviado

## 📊 Monitoramento

### Console do Navegador
Abra o DevTools (F12) para ver:
- Logs de operações
- Erros de JavaScript
- Requisições de API

### LocalStorage
Verifique dados salvos:
```javascript
// No console do navegador
console.log(localStorage.getItem('e2e_user_data'));
```

## 🚀 Deploy

### Hospedagem Estática
- **GitHub Pages**: Upload dos arquivos
- **Netlify**: Drag & drop da pasta
- **Vercel**: Conecte o repositório
- **Firebase Hosting**: Deploy via CLI

### Configuração de Deploy
```bash
# Build (se necessário)
npm run build

# Upload dos arquivos:
# - index.html
# - demo.html
# - styles.css
# - script.js
# - README.md
```

## 📞 Suporte

### Problemas Comuns
1. **Página não carrega**: Verifique conexão com internet
2. **APIs não funcionam**: Use servidor local
3. **Dados não salvam**: Verifique LocalStorage
4. **Layout quebrado**: Limpe cache do navegador

### Contato
- **Email**: suporte@e2etreinamentos.com
- **GitHub**: [Issues do projeto]
- **Documentação**: README.md

---

**E2E-Commerce** - Sistema desenvolvido para demonstração e aprendizado. 🎓
