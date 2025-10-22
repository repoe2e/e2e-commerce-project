# 🚀 Cloudflare Setup Guide - E2E-Commerce

## 📋 **Passo a Passo Completo:**

### **1. CONTA CLOUDFLARE (5 minutos)**

#### **1.1 Criar Conta:**
1. **Acesse**: https://cloudflare.com
2. **Clique** "Sign Up"
3. **Preencha** dados pessoais
4. **Verifique** email
5. **Faça login** na conta

#### **1.2 Configurar Perfil:**
1. **Dashboard** → Account Settings
2. **Adicione** método de pagamento (gratuito)
3. **Configure** notificações
4. **Ative** 2FA (recomendado)

---

### **2. CLOUDFLARE WORKERS (10 minutos)**

#### **2.1 Ativar Workers:**
1. **Dashboard** → Workers & Pages
2. **Clique** "Create application"
3. **Escolha** "Create Worker"
4. **Nome**: `e2e-commerce-api`
5. **Clique** "Deploy"

#### **2.2 Configurar Worker:**
1. **Workers** → `e2e-commerce-api`
2. **Settings** → Variables
3. **Adicione** variáveis:
   - `JWT_SECRET`: `sua-chave-secreta-super-segura`
   - `DB_URL`: `https://api.cloudflare.com/d1`
4. **Save** configurações

---

### **3. CLOUDFLARE D1 DATABASE (15 minutos)**

#### **3.1 Criar Database:**
1. **Dashboard** → D1 SQL
2. **Clique** "Create database"
3. **Nome**: `e2e-commerce-db`
4. **Região**: `auto` (mais próxima)
5. **Clique** "Create"

#### **3.2 Configurar Schema:**
1. **Database** → `e2e-commerce-db`
2. **Console** → Execute SQL
3. **Cole** o schema SQL (fornecido abaixo)
4. **Execute** para criar tabelas

#### **3.3 Conectar ao Worker:**
1. **Database** → Settings
2. **Copy** Database ID
3. **Workers** → `e2e-commerce-api` → Settings
4. **Bindings** → Add binding
5. **Type**: D1 Database
6. **Variable name**: `DB`
7. **Database**: `e2e-commerce-db`
8. **Save**

---

### **4. CÓDIGO DO WORKER (20 minutos)**

#### **4.1 Estrutura do Projeto:**
```
e2e-commerce-api/
├── src/
│   ├── index.js          # Main worker
│   ├── auth.js           # Authentication
│   ├── users.js          # User management
│   └── utils.js          # Utilities
├── wrangler.toml         # Configuration
└── package.json          # Dependencies
```

#### **4.2 Instalar Wrangler CLI:**
```bash
npm install -g wrangler
wrangler login
```

#### **4.3 Criar Projeto:**
```bash
mkdir e2e-commerce-api
cd e2e-commerce-api
wrangler init
```

---

### **5. CONFIGURAÇÃO DO DOMAIN (10 minutos)**

#### **5.1 Adicionar Domain:**
1. **Dashboard** → Workers & Pages
2. **Custom Domains** → Add domain
3. **Domain**: `api.e2ecommerce.com`
4. **Configure** DNS records
5. **SSL/TLS** → Full (strict)

#### **5.2 Configurar CORS:**
1. **Workers** → `e2e-commerce-api`
2. **Settings** → Environment variables
3. **Adicione**:
   - `ALLOWED_ORIGINS`: `https://e2ecommerce.com,http://localhost:3000`
4. **Save**

---

### **6. DEPLOYMENT (5 minutos)**

#### **6.1 Deploy Worker:**
```bash
cd e2e-commerce-api
wrangler deploy
```

#### **6.2 Verificar Deploy:**
1. **Workers** → `e2e-commerce-api`
2. **Logs** → Verificar se está funcionando
3. **Test** → Fazer requisições de teste

---

### **7. TESTING (10 minutos)**

#### **7.1 Testar Endpoints:**
```bash
# Testar health check
curl https://api.e2ecommerce.com/health

# Testar registro
curl -X POST https://api.e2ecommerce.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Testar login
curl -X POST https://api.e2ecommerce.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### **7.2 Verificar Logs:**
1. **Workers** → `e2e-commerce-api` → Logs
2. **Verificar** se requests estão chegando
3. **Debug** se necessário

---

## 🎯 **RESULTADO FINAL:**

### **API Endpoints Disponíveis:**
- ✅ `POST /auth/register` - Criar usuário
- ✅ `POST /auth/login` - Fazer login
- ✅ `POST /auth/logout` - Fazer logout
- ✅ `GET /auth/me` - Dados do usuário
- ✅ `GET /health` - Health check

### **Funcionalidades:**
- ✅ **Autenticação JWT** segura
- ✅ **Banco de dados** D1 integrado
- ✅ **CORS** configurado
- ✅ **SSL** automático
- ✅ **Escalabilidade** automática

---

## 💰 **CUSTOS:**

### **Cloudflare Workers:**
- ✅ **100.000 requests/dia** - GRATUITO
- ✅ **10ms CPU time** - GRATUITO
- ✅ **1GB storage** - GRATUITO

### **Cloudflare D1:**
- ✅ **5GB storage** - GRATUITO
- ✅ **25M reads/dia** - GRATUITO
- ✅ **5M writes/dia** - GRATUITO

**Total: GRATUITO para desenvolvimento e pequeno/médio tráfego!** 🎉

---

## 🚀 **PRÓXIMOS PASSOS:**

1. **Seguir** este guia passo a passo
2. **Implementar** código do Worker
3. **Configurar** banco de dados
4. **Testar** endpoints
5. **Integrar** com frontend

**Vamos começar?** 🚀✨
