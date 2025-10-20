# E2E-Commerce - Sistema Completo de E-commerce

Bem-vindo à documentação oficial do **E2E-Commerce**, nossa plataforma web responsiva de **marketplace** que conecta fornecedores e clientes em um ambiente de compra e venda simples, seguro e escalável.

## 🚀 Funcionalidades Principais

### ✅ Sistema de Autenticação
- **Cadastro de usuário** com validações completas
- **Login seguro** com integração DummyJSON
- **Perfis diferenciados** (Cliente/Vendedor)
- **Sessão automática** com timeout de 30 minutos
- **Validação de senha** robusta (mínimo 10 caracteres com números, letras e caracteres especiais)

### 🛍️ Catálogo de Produtos
- **Integração com DummyJSON API** para produtos reais
- **Busca inteligente** por nome, descrição e categoria
- **Filtros avançados** por categoria e ordenação
- **Interface responsiva** com cards de produtos
- **Sistema de avaliações** com estrelas

### 🛒 Carrinho de Compras
- **Adicionar/remover produtos** com controle de quantidade
- **Cálculo automático** de subtotal e frete
- **Frete grátis** para compras acima de R$ 399,00
- **Persistência local** dos dados do carrinho
- **Validação de estoque** antes da finalização

### 💳 Sistema de Pagamento
- **Múltiplas formas de pagamento**:
  - PIX com QR Code e chave
  - Cartão de Crédito com parcelamento (1-10x)
  - Cartão de Débito
- **Cálculo de juros** para parcelamento (1% a.m.)
- **Validação de cartões** com dados mockados
- **Simulação de processamento** de pagamento

### 📦 Gestão de Pedidos
- **Criação de pedidos** com validações completas
- **Status de pedidos** com fluxo definido:
  - Aguardando Pagamento → Pago → Em Transporte → Entregue
- **Cancelamento de pedidos** com motivo obrigatório
- **Solicitação de devolução** com prazos diferenciados
- **Histórico completo** de pedidos

### 🏠 Gestão de Endereços
- **Até 3 endereços** por usuário (Residencial, Comercial, Entrega)
- **Integração com ViaCEP** para preenchimento automático
- **Validação de CEP** e dados de endereço
- **Edição e exclusão** de endereços

### 🔒 Segurança e Sessão
- **Criptografia de senhas** (simulada)
- **Timeout automático** após 30 minutos de inatividade
- **Validação de dados** em frontend e backend
- **Mascaramento de dados** sensíveis (cartões)

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript ES6+** - Lógica de negócio e interações
- **DummyJSON API** - Dados de produtos e autenticação
- **ViaCEP API** - Consulta de endereços por CEP
- **LocalStorage** - Persistência de dados local
- **Font Awesome** - Ícones e elementos visuais

## 📱 Design Responsivo

O sistema foi desenvolvido com foco em **responsividade**, funcionando perfeitamente em:
- 💻 **Desktop** (1200px+)
- 📱 **Tablet** (768px - 1199px)
- 📱 **Mobile** (até 767px)

## 🎨 Interface Moderna

- **Design inspirado no Amazon** com cores e layout profissionais
- **Gradientes e sombras** para profundidade visual
- **Animações suaves** para melhor UX
- **Modais e notificações** para feedback do usuário
- **Loading states** para operações assíncronas

## 🚀 Como Usar

### 1. Acesso ao Sistema
1. Abra o arquivo `index.html` em seu navegador
2. Clique em "Entrar" para fazer login ou cadastro
3. Use as credenciais do DummyJSON ou crie uma nova conta

### 2. Navegação
- **Início**: Página principal com features e navegação
- **Produtos**: Catálogo completo com filtros e busca
- **Pedidos**: Histórico e gestão de pedidos
- **Perfil**: Dados pessoais, endereços e segurança

### 3. Processo de Compra
1. **Navegue** pelos produtos e adicione ao carrinho
2. **Acesse o carrinho** e revise os itens
3. **Finalize a compra** selecionando endereço e pagamento
4. **Confirme o pedido** e acompanhe o status

## 🔧 Configurações

### Dados Mockados para Teste

#### Cartões de Crédito (Aprovados)
- **VISA**: 4111111111111111 (CVV: 123)
- **MASTERCARD**: 5555555555554444 (CVV: 321)

#### Cartões de Crédito (Reprovados)
- **VISA**: 4000000000000002 (CVV: 123)
- **MASTERCARD**: 5105105105105100 (CVV: 321)

#### Cartões de Débito (Aprovados)
- **VISA**: 4900000000000000 (CVV: 111)
- **MASTERCARD**: 5200828282828210 (CVV: 222)

#### Cartões de Débito (Reprovados)
- **VISA**: 4916000000000000 (CVV: 111)
- **MASTERCARD**: 5200000000000007 (CVV: 222)

### Credenciais de Teste (DummyJSON)
- **Usuário**: `emilys`
- **Senha**: `emilyspass`

## 📋 Regras de Negócio Implementadas

### ✅ Autenticação
- [x] Cadastro com validação de email único
- [x] Senha com mínimo 10 caracteres + números + letras + especiais
- [x] Login com credenciais válidas
- [x] Perfis diferenciados (Cliente/Vendedor)
- [x] Edição apenas dos próprios dados
- [x] Confirmação antes da exclusão
- [x] Timeout automático de 30 minutos

### ✅ Produtos e Carrinho
- [x] Listagem de produtos via API
- [x] Adição/remoção de produtos
- [x] Controle de quantidade
- [x] Cálculo automático de totais
- [x] Validação de estoque
- [x] Frete grátis acima de R$ 399,00

### ✅ Pedidos
- [x] Criação com produtos do carrinho
- [x] Cálculo automático de valores
- [x] Status com fluxo definido
- [x] Cancelamento com motivo
- [x] Devolução com prazos
- [x] Histórico completo

### ✅ Pagamento
- [x] PIX com QR Code
- [x] Cartão de crédito com parcelamento
- [x] Cartão de débito
- [x] Cálculo de juros (1% a.m.)
- [x] Validação de cartões
- [x] Simulação de processamento

### ✅ Endereços
- [x] Até 3 endereços por usuário
- [x] Integração com ViaCEP
- [x] Tipos: Residencial, Comercial, Entrega
- [x] Edição e exclusão

## 🎯 Funcionalidades Avançadas

### Sistema de Notificações
- **Toast notifications** para feedback imediato
- **Loading states** durante operações
- **Modais** para confirmações importantes

### Validações Robustas
- **Frontend**: Validação em tempo real
- **Formatação automática**: CEP, cartão, data
- **Máscaras de entrada** para dados sensíveis

### Persistência de Dados
- **LocalStorage** para dados do usuário
- **Sessão persistente** entre recarregamentos
- **Backup automático** de carrinho e pedidos

## 🔮 Próximas Funcionalidades

- [ ] **Sistema de avaliações** de produtos
- [ ] **Wishlist** de produtos favoritos
- [ ] **Cupons de desconto**
- [ ] **Programa de fidelidade**
- [ ] **Chat de suporte**
- [ ] **Relatórios de vendas** (para vendedores)
- [ ] **Integração com APIs reais** de pagamento
- [ ] **Sistema de notificações** push

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema E2E-Commerce, entre em contato através dos canais oficiais.

---

**E2E-Commerce** - Desenvolvido com ❤️ para proporcionar a melhor experiência de e-commerce.
