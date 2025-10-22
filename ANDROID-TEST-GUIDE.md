# 📱 Testando PWA no Android Studio - E2E-Commerce

## 🎯 **Opções de Teste**

### **Opção 1: Emulador Android (Mais Fácil)**

#### **1. Configurar Emulador:**
1. **Abra** Android Studio
2. **Vá** em AVD Manager (ícone do telefone)
3. **Clique** "Create Virtual Device"
4. **Escolha** um dispositivo (ex: Pixel 4)
5. **Escolha** API Level 30+ (Android 11+)
6. **Clique** "Finish"

#### **2. Iniciar Emulador:**
1. **Clique** no botão ▶️ no emulador criado
2. **Aguarde** o emulador inicializar
3. **Abra** Chrome no emulador

#### **3. Acessar PWA:**
1. **Digite** na barra de endereço: `http://10.0.2.2:3000`
2. **Teste** todas as funcionalidades
3. **Verifique** se PWA instala

### **Opção 2: Dispositivo Real**

#### **1. Conectar Android:**
1. **Conecte** seu Android via USB
2. **Ative** "Depuração USB" nas configurações
3. **Autorize** no computador quando aparecer

#### **2. Acessar via IP:**
1. **No Android**, abra Chrome
2. **Digite**: `http://192.168.15.3:3000`
3. **Teste** o PWA

### **Opção 3: App Android Nativo (WebView)**

#### **1. Criar Projeto Android:**
1. **Abra** Android Studio
2. **New Project** → "Empty Activity"
3. **Nome**: E2E-Commerce Test
4. **Package**: com.e2ecommerce.test
5. **Language**: Java
6. **Minimum SDK**: API 21

#### **2. Configurar WebView:**
1. **Substitua** o conteúdo dos arquivos pelos criados em `android-test/`
2. **Sincronize** o projeto
3. **Execute** no emulador ou dispositivo

#### **3. Testar PWA:**
1. **App carrega** automaticamente o PWA
2. **Teste** todas as funcionalidades
3. **Verifique** se funciona como app nativo

## 🧪 **Testes Específicos**

### **A. Funcionalidades PWA:**
- ✅ **Instalação**: Banner "Adicionar à tela inicial"
- ✅ **Offline**: Desconecte WiFi e teste
- ✅ **Ícones**: App aparece com ícone personalizado
- ✅ **Fullscreen**: Sem barra do navegador
- ✅ **Cache**: Carregamento rápido após primeira visita

### **B. Funcionalidades E-commerce:**
- ✅ **Login**: `emilys` / `emilyspass`
- ✅ **Produtos**: Carregam da API
- ✅ **Carrinho**: Adicionar/remover produtos
- ✅ **Checkout**: Processo completo
- ✅ **Pedidos**: Histórico salvo
- ✅ **Endereços**: Gestão de endereços

### **C. Responsividade:**
- ✅ **Portrait**: Funciona em modo retrato
- ✅ **Landscape**: Funciona em modo paisagem
- ✅ **Touch**: Toques funcionam corretamente
- ✅ **Scroll**: Rolagem suave

## 🔧 **Configurações Importantes**

### **WebView Settings:**
```java
// JavaScript habilitado
webSettings.setJavaScriptEnabled(true);

// LocalStorage habilitado
webSettings.setDomStorageEnabled(true);

// Cache habilitado
webSettings.setAppCacheEnabled(true);

// Geolocalização habilitada
webSettings.setGeolocationEnabled(true);

// HTTP/HTTPS permitido
webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
```

### **Manifest Android:**
```xml
<!-- Permissões necessárias -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Permitir HTTP (para desenvolvimento) -->
<application android:usesCleartextTraffic="true">
```

## 🐛 **Problemas Comuns**

### **PWA não instala:**
- Verificar se HTTPS (use ngrok se necessário)
- Verificar se ícones existem
- Verificar manifest.json

### **WebView não carrega:**
- Verificar se servidor está rodando
- Verificar IP correto
- Verificar permissões de internet

### **Funcionalidades não funcionam:**
- Verificar se JavaScript está habilitado
- Verificar console para erros
- Verificar se APIs externas funcionam

## 🚀 **Comandos Úteis**

### **Iniciar Servidor:**
```bash
# Servidor local
npx http-server . -p 3000

# Com HTTPS (para PWA)
npx ngrok http 3000
```

### **Verificar IP:**
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

### **Testar Conectividade:**
```bash
# Ping do emulador
ping 10.0.2.2

# Ping do dispositivo
ping 192.168.15.3
```

## 📊 **Checklist de Teste**

### **Emulador:**
- [ ] Emulador inicia corretamente
- [ ] Chrome abre no emulador
- [ ] PWA carrega em `http://10.0.2.2:3000`
- [ ] Banner de instalação aparece
- [ ] PWA instala na tela inicial
- [ ] Funciona offline
- [ ] Todas funcionalidades web funcionam

### **Dispositivo Real:**
- [ ] Android conectado via USB
- [ ] Depuração USB ativada
- [ ] PWA carrega em `http://192.168.15.3:3000`
- [ ] Banner de instalação aparece
- [ ] PWA instala na tela inicial
- [ ] Funciona offline
- [ ] Todas funcionalidades web funcionam

### **App Nativo:**
- [ ] Projeto Android criado
- [ ] WebView configurado
- [ ] PWA carrega automaticamente
- [ ] Funciona como app nativo
- [ ] Todas funcionalidades funcionam

## 🎯 **Próximos Passos**

1. **Escolha** uma opção de teste
2. **Configure** o ambiente
3. **Teste** todas as funcionalidades
4. **Verifique** se PWA funciona
5. **Reporte** problemas encontrados

---

**E2E-Commerce** - Testado em todas as plataformas! 📱✨

