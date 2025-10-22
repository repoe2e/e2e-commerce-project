# 🚀 E2E-Commerce API - Cloudflare Workers

## 📋 **Visão Geral:**

API backend completa para o sistema E2E-Commerce, construída com Cloudflare Workers e D1 Database.

## 🏗️ **Arquitetura:**

### **Tecnologias:**
- ✅ **Cloudflare Workers** - Serverless functions
- ✅ **Cloudflare D1** - SQLite database
- ✅ **JWT** - Authentication tokens
- ✅ **CORS** - Cross-origin requests
- ✅ **HTTPS** - Secure connections

### **Endpoints Disponíveis:**

#### **Authentication:**
- `POST /auth/register` - Criar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/logout` - Fazer logout
- `GET /auth/me` - Dados do usuário atual

#### **User Management:**
- `GET /users/profile` - Obter perfil do usuário
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/password` - Alterar senha
- `DELETE /users/account` - Deletar conta

#### **System:**
- `GET /health` - Health check

## 🚀 **Deployment:**

### **1. Instalar Dependências:**
```bash
cd cloudflare-worker
npm install
```

### **2. Configurar Wrangler:**
```bash
wrangler login
wrangler init
```

### **3. Configurar Database:**
```bash
# Criar database
wrangler d1 create e2e-commerce-db

# Executar schema
wrangler d1 execute e2e-commerce-db --file=database-schema.sql
```

### **4. Deploy:**
```bash
wrangler deploy
```

## 🔧 **Configuração:**

### **Variáveis de Ambiente:**
- `JWT_SECRET` - Chave secreta para JWT
- `ALLOWED_ORIGINS` - Origens permitidas para CORS
- `DB` - Binding para D1 Database

### **Database Schema:**
- **users** - Dados dos usuários
- **products** - Catálogo de produtos
- **orders** - Pedidos dos usuários
- **order_items** - Itens dos pedidos
- **user_addresses** - Endereços dos usuários
- **sessions** - Sessões ativas

## 🧪 **Testing:**

### **Health Check:**
```bash
curl https://api.e2ecommerce.com/health
```

### **Register User:**
```bash
curl -X POST https://api.e2ecommerce.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123456",
    "profile": "client"
  }'
```

### **Login:**
```bash
curl -X POST https://api.e2ecommerce.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

### **Get Profile:**
```bash
curl -X GET https://api.e2ecommerce.com/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 **Performance:**

### **Cloudflare Workers:**
- ✅ **100.000 requests/dia** - GRATUITO
- ✅ **10ms CPU time** - GRATUITO
- ✅ **1GB storage** - GRATUITO

### **Cloudflare D1:**
- ✅ **5GB storage** - GRATUITO
- ✅ **25M reads/dia** - GRATUITO
- ✅ **5M writes/dia** - GRATUITO

## 🔒 **Segurança:**

### **Implementado:**
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **Password Hashing** - Senhas criptografadas
- ✅ **CORS Protection** - Controle de origem
- ✅ **Input Validation** - Validação de dados
- ✅ **SQL Injection Protection** - Prepared statements

### **Recomendações:**
- 🔐 **Use HTTPS** sempre
- 🔐 **Rotacione JWT_SECRET** regularmente
- 🔐 **Implemente rate limiting** se necessário
- 🔐 **Monitore logs** para segurança

## 📱 **Integração Frontend:**

### **Exemplo de Uso:**
```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('https://api.e2ecommerce.com/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('https://api.e2ecommerce.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

// Get user profile
const getUserProfile = async (token) => {
  const response = await fetch('https://api.e2ecommerce.com/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

## 🎯 **Próximos Passos:**

1. **Deploy** da API no Cloudflare
2. **Configurar** domínio personalizado
3. **Integrar** com frontend E2E-Commerce
4. **Testar** funcionalidades completas
5. **Monitorar** performance e logs

---

**API pronta para deployment!** 🚀✨
