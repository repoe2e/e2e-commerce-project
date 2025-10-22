// E2E-Commerce - Sistema Completo de E-commerce
class E2ECommerce {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.orders = [];
        this.addresses = [];
        this.products = [];
        this.currentPage = 'home';
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.sessionTimer = null;
        
        this.init();
    }

    init() {
        this.cleanupOldData();
        this.loadUserData();
        this.setupEventListeners();
        this.showPage('home');
        this.loadProducts();
        this.updateCartDisplay();
        this.startSessionTimer();
        this.registerServiceWorker();
        this.setupPWAInstall();
    }

    // ==================== LIMPEZA DE DADOS ====================
    
    // Limpar dados antigos/inválidos
    cleanupOldData() {
        // Verificar se há dados de sessão antigos sem timestamp
        const userData = JSON.parse(localStorage.getItem('e2e_user_data') || '{}');
        const sessionTimestamp = localStorage.getItem('e2e_session_timestamp');
        
        if (userData.currentUser && !sessionTimestamp) {
            // Dados antigos sem timestamp - limpar
            this.clearLocalStorage();
            console.log('Dados antigos limpos - sem timestamp de sessão');
        }
        
        // Verificar se há dados corrompidos
        try {
            const testData = JSON.parse(localStorage.getItem('e2e_user_data') || '{}');
            if (testData.currentUser && (!testData.currentUser.id || !testData.currentUser.fullName)) {
                // Dados corrompidos - limpar
                this.clearLocalStorage();
                console.log('Dados corrompidos limpos');
            }
        } catch (error) {
            // Dados inválidos - limpar
            this.clearLocalStorage();
            console.log('Dados inválidos limpos');
        }
    }

    // ==================== SISTEMA DE AUTENTICAÇÃO ====================
    
    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Botões de página
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Modal de login
        document.getElementById('userBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.logout();
            } else {
                this.showModal('loginModal');
            }
        });

        // Formulários de autenticação
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Alternar entre modais
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('registerModal');
            this.showModal('loginModal');
        });

        // Fechar modais
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.hideModal(modalId);
            });
        });

        // Carrinho
        document.getElementById('cartIcon').addEventListener('click', () => {
            this.showPage('cart');
        });

        // Busca
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Filtros de produtos
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('sortFilter').addEventListener('change', () => {
            this.sortProducts();
        });

        // Perfil
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        document.getElementById('securityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePassword();
        });

        // Endereços
        document.getElementById('addAddressBtn').addEventListener('click', () => {
            this.showAddressModal();
        });

        document.getElementById('addressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAddress();
        });

        // CEP
        document.getElementById('addressCep').addEventListener('blur', () => {
            this.lookupCEP();
        });

        // Validação em tempo real do nome completo
        document.getElementById('registerFullName').addEventListener('input', (e) => {
            this.validateFullNameField(e.target);
        });

        document.getElementById('fullName').addEventListener('input', (e) => {
            this.validateFullNameField(e.target);
        });

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.startCheckout();
        });

        document.getElementById('checkoutNext').addEventListener('click', () => {
            this.nextCheckoutStep();
        });

        document.getElementById('checkoutPrev').addEventListener('click', () => {
            this.prevCheckoutStep();
        });

        document.getElementById('checkoutConfirm').addEventListener('click', () => {
            this.confirmOrder();
        });

        // Métodos de pagamento
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPaymentMethod(e.target.getAttribute('data-method'));
            });
        });

        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Modal de logout
        document.getElementById('confirmLogout').addEventListener('click', () => {
            this.confirmLogout();
        });

        document.getElementById('cancelLogout').addEventListener('click', () => {
            this.cancelLogout();
        });

        // Fechar modal de logout com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const logoutModal = document.getElementById('logoutModal');
                if (logoutModal && logoutModal.style.display === 'block') {
                    this.cancelLogout();
                }
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            this.showLoading();
            
            // Simular autenticação com DummyJSON
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = {
                    id: userData.id,
                    fullName: userData.firstName + ' ' + userData.lastName,
                    email: userData.email,
                    profile: 'client' // Default profile
                };
                
                // Salvar timestamp da sessão
                localStorage.setItem('e2e_session_timestamp', Date.now().toString());
                
                this.saveUserData();
                this.updateUserDisplay();
                this.hideModal('loginModal');
                this.showToast('Login realizado com sucesso!', 'success');
                this.resetSessionTimer();
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (error) {
            this.showToast('E-mail ou senha incorretos', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister() {
        const fullName = document.getElementById('registerFullName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const profile = document.getElementById('registerProfile').value;

        // Validações
        if (!this.validateFullName(fullName)) {
            this.showToast('Nome completo deve ter pelo menos 3 letras no nome e pelo menos 1 letra no sobrenome', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('E-mail inválido', 'error');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showToast('Senha deve ter no mínimo 10 caracteres com números, letras e caracteres especiais', 'error');
            return;
        }

        try {
            this.showLoading();
            
            // Simular cadastro
            const userData = {
                id: Date.now(),
                fullName: fullName,
                email: email,
                profile: profile,
                createdAt: new Date().toISOString()
            };

            // Verificar se email já existe
            const existingUsers = JSON.parse(localStorage.getItem('e2e_users') || '[]');
            if (existingUsers.find(u => u.email === email)) {
                throw new Error('E-mail já cadastrado');
            }

            existingUsers.push(userData);
            localStorage.setItem('e2e_users', JSON.stringify(existingUsers));

            this.currentUser = userData;
            
            // Salvar timestamp da sessão
            localStorage.setItem('e2e_session_timestamp', Date.now().toString());
            
            this.saveUserData();
            this.updateUserDisplay();
            this.hideModal('registerModal');
            this.showToast('Cadastro realizado com sucesso!', 'success');
            this.resetSessionTimer();
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    logout() {
        this.showLogoutModal();
    }

    // Mostrar modal de logout personalizado
    showLogoutModal() {
        this.showModal('logoutModal');
    }

    // Confirmar logout
    confirmLogout() {
        // Limpar todos os dados do usuário
        this.clearUserData();
        this.clearSessionTimer();
        
        // Limpar localStorage completamente
        this.clearLocalStorage();
        
        // Fechar modal
        this.hideModal('logoutModal');
        
        // Mostrar mensagem de sucesso
        this.showToast('Logout realizado com sucesso!', 'success');
        
        // Forçar reload da página para garantir logout completo
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Cancelar logout
    cancelLogout() {
        this.hideModal('logoutModal');
    }

    // ==================== VALIDAÇÕES ====================

    validatePassword(password) {
        if (password.length < 10) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[a-zA-Z]/.test(password)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateFullName(fullName) {
        if (!fullName || fullName.trim().length === 0) {
            return false;
        }
        
        // Remover espaços extras e dividir em palavras
        const names = fullName.trim().split(/\s+/);
        
        // Deve ter pelo menos 2 palavras (nome e sobrenome)
        if (names.length < 2) {
            return false;
        }
        
        // Primeira palavra (nome) deve ter pelo menos 3 letras
        if (names[0].length < 3) {
            return false;
        }
        
        // Pelo menos uma das outras palavras (sobrenome) deve ter pelo menos 1 letra
        const hasValidSurname = names.slice(1).some(name => name.length >= 1);
        
        return hasValidSurname;
    }

    // Validação em tempo real do campo nome completo
    validateFullNameField(field) {
        const value = field.value.trim();
        const isValid = this.validateFullName(value);
        
        // Remover classes de validação anteriores
        field.classList.remove('valid', 'invalid');
        
        if (value.length === 0) {
            // Campo vazio - não mostrar erro ainda
            return;
        }
        
        if (isValid) {
            field.classList.add('valid');
            this.removeFieldError(field);
        } else {
            field.classList.add('invalid');
            this.showFieldError(field, 'Nome deve ter pelo menos 3 letras e sobrenome com pelo menos 1 letra');
        }
    }

    // Mostrar erro no campo
    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }

    // Remover erro do campo
    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // ==================== GESTÃO DE DADOS ====================

    saveUserData() {
        const userData = {
            currentUser: this.currentUser,
            cart: this.cart,
            orders: this.orders,
            addresses: this.addresses
        };
        localStorage.setItem('e2e_user_data', JSON.stringify(userData));
    }

    // Limpar dados do localStorage
    clearLocalStorage() {
        localStorage.removeItem('e2e_user_data');
        localStorage.removeItem('e2e_users');
        localStorage.removeItem('e2e_session_timestamp');
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('e2e_user_data') || '{}');
        this.currentUser = userData.currentUser || null;
        this.cart = userData.cart || [];
        this.orders = userData.orders || [];
        this.addresses = userData.addresses || [];
        
        // Verificar se a sessão ainda é válida
        if (this.currentUser) {
            // Verificar se há timestamp de sessão
            const sessionTimestamp = localStorage.getItem('e2e_session_timestamp');
            const now = Date.now();
            const sessionTimeout = 30 * 60 * 1000; // 30 minutos
            
            if (sessionTimestamp && (now - parseInt(sessionTimestamp)) > sessionTimeout) {
                // Sessão expirada - fazer logout automático
                this.clearUserData();
                this.clearLocalStorage();
                this.showToast('Sessão expirada. Faça login novamente.', 'warning');
            } else {
                // Sessão válida - atualizar timestamp
                localStorage.setItem('e2e_session_timestamp', now.toString());
                this.updateUserDisplay();
            }
        }
    }

    // ==================== SESSÃO E SEGURANÇA ====================

    startSessionTimer() {
        this.clearSessionTimer();
        this.sessionTimer = setTimeout(() => {
            this.logout();
            this.showToast('Sessão expirada por inatividade', 'warning');
        }, this.sessionTimeout);
    }

    resetSessionTimer() {
        this.startSessionTimer();
    }

    clearSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    // Limpar completamente os dados do usuário
    clearUserData() {
        this.currentUser = null;
        this.cart = [];
        this.orders = [];
        this.addresses = [];
        this.saveUserData();
        this.updateUserDisplay();
        this.updateCartDisplay();
        this.showPage('home');
    }

    // ==================== NAVEGAÇÃO ====================

    showPage(page) {
        // Verificar se a página requer login
        const protectedPages = ['cart', 'orders', 'profile'];
        if (protectedPages.includes(page) && !this.currentUser) {
            this.showToast('Faça login para acessar esta página', 'warning');
            this.showModal('loginModal');
            return;
        }
        
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Mostrar página selecionada
        const pageElement = document.getElementById(page + 'Page');
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = page;
            
            // Carregar dados específicos da página
            switch(page) {
                case 'products':
                    this.loadProducts();
                    break;
                case 'cart':
                    this.loadCart();
                    break;
                case 'orders':
                    this.loadOrders();
                    break;
                case 'profile':
                    this.loadProfile();
                    break;
            }
        }
    }

    updateUserDisplay() {
        const userName = document.getElementById('userName');
        const userBtn = document.getElementById('userBtn');
        
        if (this.currentUser) {
            userName.textContent = this.currentUser.fullName;
            userBtn.innerHTML = `<i class="fas fa-user"></i> <span>${this.currentUser.fullName}</span>`;
            userBtn.title = 'Clique para sair';
        } else {
            userName.textContent = 'Entrar';
            userBtn.innerHTML = '<i class="fas fa-user"></i> <span>Entrar</span>';
            userBtn.title = 'Clique para entrar';
        }
    }

    // ==================== PRODUTOS ====================

    async loadProducts() {
        try {
            this.showLoading();
            const response = await fetch('https://dummyjson.com/products?limit=20');
            const data = await response.json();
            this.products = data.products;
            this.displayProducts();
            this.loadCategories();
        } catch (error) {
            this.showToast('Erro ao carregar produtos', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+'">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <div class="product-rating">
                    <div class="stars">${this.generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <button class="add-to-cart" onclick="e2eCommerce.addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    loadCategories() {
        const categories = [...new Set(this.products.map(p => p.category))];
        const select = document.getElementById('categoryFilter');
        select.innerHTML = '<option value="">Todas as categorias</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        const filteredProducts = category ? 
            this.products.filter(p => p.category === category) : 
            this.products;
        
        this.displayFilteredProducts(filteredProducts);
    }

    sortProducts() {
        const sortBy = document.getElementById('sortFilter').value;
        const sortedProducts = [...this.products].sort((a, b) => {
            switch(sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'price':
                    return a.price - b.price;
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });
        
        this.displayFilteredProducts(sortedProducts);
    }

    displayFilteredProducts(products) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    handleSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (!query) return;

        const filteredProducts = this.products.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        this.displayFilteredProducts(filteredProducts);
        this.showPage('products');
    }

    // ==================== CARRINHO ====================

    addToCart(productId) {
        if (!this.currentUser) {
            this.showToast('Faça login para adicionar produtos ao carrinho', 'warning');
            this.showModal('loginModal');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1
            });
        }

        this.saveUserData();
        this.updateCartDisplay();
        this.showToast('Produto adicionado ao carrinho!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveUserData();
        this.updateCartDisplay();
        this.loadCart();
        this.showToast('Produto removido do carrinho', 'success');
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveUserData();
                this.updateCartDisplay();
                this.loadCart();
            }
        }
    }

    updateCartDisplay() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    loadCart() {
        const container = document.getElementById('cartItems');
        container.innerHTML = '';

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="text-center">Carrinho vazio</p>';
            return;
        }

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW08L3RleHQ+PC9zdmc+'">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="e2eCommerce.updateCartQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="e2eCommerce.updateCartQuantity(${item.id}, parseInt(this.value))">
                            <button class="quantity-btn" onclick="e2eCommerce.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="e2eCommerce.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(cartItem);
        });

        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 399 ? 0 : 100;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // ==================== CHECKOUT ====================

    startCheckout() {
        if (!this.currentUser) {
            this.showToast('Faça login para finalizar a compra', 'warning');
            this.showModal('loginModal');
            return;
        }

        if (this.cart.length === 0) {
            this.showToast('Carrinho vazio', 'warning');
            return;
        }

        this.showModal('checkoutModal');
        this.loadCheckoutAddresses();
        this.resetCheckoutSteps();
    }

    resetCheckoutSteps() {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active', 'completed'));
        document.querySelectorAll('.step-pane').forEach(pane => pane.classList.remove('active'));
        
        document.querySelector('.step[data-step="address"]').classList.add('active');
        document.getElementById('checkoutAddress').classList.add('active');
        
        document.getElementById('checkoutPrev').style.display = 'none';
        document.getElementById('checkoutNext').style.display = 'inline-block';
        document.getElementById('checkoutConfirm').style.display = 'none';
    }

    loadCheckoutAddresses() {
        const container = document.getElementById('checkoutAddresses');
        container.innerHTML = '';

        if (this.addresses.length === 0) {
            container.innerHTML = '<p>Nenhum endereço cadastrado. <a href="#" onclick="e2eCommerce.showAddressModal()">Cadastrar endereço</a></p>';
            return;
        }

        this.addresses.forEach(address => {
            const addressOption = document.createElement('div');
            addressOption.className = 'address-option';
            addressOption.innerHTML = `
                <div class="address-type">${this.getAddressTypeLabel(address.type)}</div>
                <div class="address-info">
                    <p><strong>${address.street}, ${address.number}</strong></p>
                    <p>${address.complement ? address.complement + ', ' : ''}${address.neighborhood}</p>
                    <p>${address.city} - ${address.state}</p>
                    <p>CEP: ${address.cep}</p>
                </div>
            `;
            
            addressOption.addEventListener('click', () => {
                document.querySelectorAll('.address-option').forEach(opt => opt.classList.remove('selected'));
                addressOption.classList.add('selected');
                this.selectedAddress = address;
            });
            
            container.appendChild(addressOption);
        });
    }

    getAddressTypeLabel(type) {
        const labels = {
            'residential': 'Residencial',
            'commercial': 'Comercial',
            'delivery': 'Entrega'
        };
        return labels[type] || type;
    }

    nextCheckoutStep() {
        const currentStep = document.querySelector('.step.active');
        const currentPane = document.querySelector('.step-pane.active');
        
        if (currentStep.getAttribute('data-step') === 'address') {
            if (!this.selectedAddress) {
                this.showToast('Selecione um endereço de entrega', 'warning');
                return;
            }
            
            currentStep.classList.remove('active');
            currentStep.classList.add('completed');
            currentPane.classList.remove('active');
            
            document.querySelector('.step[data-step="payment"]').classList.add('active');
            document.getElementById('checkoutPayment').classList.add('active');
            
            this.loadPaymentMethods();
        } else if (currentStep.getAttribute('data-step') === 'payment') {
            if (!this.validatePayment()) {
                return;
            }
            
            currentStep.classList.remove('active');
            currentStep.classList.add('completed');
            currentPane.classList.remove('active');
            
            document.querySelector('.step[data-step="confirmation"]').classList.add('active');
            document.getElementById('checkoutConfirmation').classList.add('active');
            
            this.loadOrderSummary();
            
            document.getElementById('checkoutNext').style.display = 'none';
            document.getElementById('checkoutConfirm').style.display = 'inline-block';
        }
    }

    prevCheckoutStep() {
        const currentStep = document.querySelector('.step.active');
        const currentPane = document.querySelector('.step-pane.active');
        
        if (currentStep.getAttribute('data-step') === 'payment') {
            currentStep.classList.remove('active');
            currentPane.classList.remove('active');
            
            document.querySelector('.step[data-step="address"]').classList.add('active');
            document.getElementById('checkoutAddress').classList.add('active');
            
            document.getElementById('checkoutPrev').style.display = 'none';
        } else if (currentStep.getAttribute('data-step') === 'confirmation') {
            currentStep.classList.remove('active');
            currentPane.classList.remove('active');
            
            document.querySelector('.step[data-step="payment"]').classList.add('active');
            document.getElementById('checkoutPayment').classList.add('active');
            
            document.getElementById('checkoutNext').style.display = 'inline-block';
            document.getElementById('checkoutConfirm').style.display = 'none';
        }
    }

    loadPaymentMethods() {
        // Carregar métodos de pagamento disponíveis
        this.currentPaymentMethod = 'pix';
        this.switchPaymentMethod('pix');
    }

    switchPaymentMethod(method) {
        document.querySelectorAll('.payment-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.payment-method').forEach(method => method.classList.remove('active'));
        
        document.querySelector(`.payment-tab[data-method="${method}"]`).classList.add('active');
        document.getElementById(`${method}Payment`).classList.add('active');
        
        this.currentPaymentMethod = method;
    }

    validatePayment() {
        if (this.currentPaymentMethod === 'pix') {
            return true; // PIX sempre válido
        } else if (this.currentPaymentMethod === 'credit') {
            return this.validateCreditCard();
        } else if (this.currentPaymentMethod === 'debit') {
            return this.validateDebitCard();
        }
        return false;
    }

    validateCreditCard() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('cardExpiry').value;
        const cvv = document.getElementById('cardCvv').value;
        const name = document.getElementById('cardName').value;

        if (!cardNumber || !expiry || !cvv || !name) {
            this.showToast('Preencha todos os campos do cartão', 'warning');
            return false;
        }

        if (cardNumber.length < 16) {
            this.showToast('Número do cartão inválido', 'warning');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            this.showToast('Data de validade inválida', 'warning');
            return false;
        }

        if (cvv.length < 3) {
            this.showToast('CVV inválido', 'warning');
            return false;
        }

        return true;
    }

    validateDebitCard() {
        const cardNumber = document.getElementById('debitCardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('debitCardExpiry').value;
        const cvv = document.getElementById('debitCardCvv').value;
        const name = document.getElementById('debitCardName').value;

        if (!cardNumber || !expiry || !cvv || !name) {
            this.showToast('Preencha todos os campos do cartão', 'warning');
            return false;
        }

        if (cardNumber.length < 16) {
            this.showToast('Número do cartão inválido', 'warning');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            this.showToast('Data de validade inválida', 'warning');
            return false;
        }

        if (cvv.length < 3) {
            this.showToast('CVV inválido', 'warning');
            return false;
        }

        return true;
    }

    loadOrderSummary() {
        const container = document.getElementById('orderSummary');
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 399 ? 0 : 100;
        const total = subtotal + shipping;

        container.innerHTML = `
            <div class="order-summary-content">
                <h4>Resumo do Pedido</h4>
                <div class="summary-address">
                    <h5>Endereço de Entrega</h5>
                    <p>${this.selectedAddress.street}, ${this.selectedAddress.number}</p>
                    <p>${this.selectedAddress.complement ? this.selectedAddress.complement + ', ' : ''}${this.selectedAddress.neighborhood}</p>
                    <p>${this.selectedAddress.city} - ${this.selectedAddress.state}</p>
                    <p>CEP: ${this.selectedAddress.cep}</p>
                </div>
                <div class="summary-items">
                    <h5>Itens</h5>
                    ${this.cart.map(item => `
                        <div class="summary-item">
                            <span>${item.title} x${item.quantity}</span>
                            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="summary-totals">
                    <div class="summary-total">
                        <span>Subtotal:</span>
                        <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="summary-total">
                        <span>Frete:</span>
                        <span>R$ ${shipping.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="summary-total total">
                        <span>Total:</span>
                        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <div class="summary-payment">
                    <h5>Forma de Pagamento</h5>
                    <p>${this.getPaymentMethodLabel()}</p>
                </div>
            </div>
        `;
    }

    getPaymentMethodLabel() {
        const labels = {
            'pix': 'PIX',
            'credit': 'Cartão de Crédito',
            'debit': 'Cartão de Débito'
        };
        return labels[this.currentPaymentMethod] || this.currentPaymentMethod;
    }

    async confirmOrder() {
        try {
            this.showLoading();
            
            // Simular processamento do pagamento
            const paymentResult = await this.processPayment();
            
            if (paymentResult.success) {
                // Criar pedido
                const order = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    items: [...this.cart],
                    address: this.selectedAddress,
                    paymentMethod: this.currentPaymentMethod,
                    status: 'waiting_payment',
                    total: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) + (this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) >= 399 ? 0 : 100),
                    paymentResult: paymentResult
                };

                this.orders.push(order);
                this.cart = [];
                this.saveUserData();
                this.updateCartDisplay();
                this.hideModal('checkoutModal');
                this.showToast('Pedido realizado com sucesso!', 'success');
                this.showPage('orders');
            } else {
                this.showToast(paymentResult.message, 'error');
            }
        } catch (error) {
            this.showToast('Erro ao processar pedido', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async processPayment() {
        // Simular processamento de pagamento
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: 'TXN' + Date.now(),
                    message: 'Pagamento aprovado'
                });
            }, 2000);
        });
    }

    // ==================== PEDIDOS ====================

    loadOrders() {
        const container = document.getElementById('ordersList');
        container.innerHTML = '';

        if (this.orders.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhum pedido encontrado</p>';
            return;
        }

        this.orders.forEach(order => {
            const orderCard = this.createOrderCard(order);
            container.appendChild(orderCard);
        });
    }

    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-number">Pedido #${order.id}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString('pt-BR')}</div>
                </div>
                <div class="order-status ${this.getStatusClass(order.status)}">
                    ${this.getStatusLabel(order.status)}
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.title} x${item.quantity}</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: R$ ${order.total.toFixed(2).replace('.', ',')}</div>
            <div class="order-actions">
                ${this.getOrderActions(order)}
            </div>
        `;
        return card;
    }

    getStatusClass(status) {
        const classes = {
            'waiting_payment': 'status-waiting',
            'paid': 'status-paid',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return classes[status] || '';
    }

    getStatusLabel(status) {
        const labels = {
            'waiting_payment': 'Aguardando Pagamento',
            'paid': 'Pago',
            'shipped': 'Em Transporte',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        };
        return labels[status] || status;
    }

    getOrderActions(order) {
        let actions = '';
        
        if (order.status === 'waiting_payment' || order.status === 'paid') {
            actions += `<button class="btn btn-danger" onclick="e2eCommerce.cancelOrder(${order.id})">Cancelar Pedido</button>`;
        }
        
        if (order.status === 'delivered') {
            actions += `<button class="btn btn-secondary" onclick="e2eCommerce.requestReturn(${order.id})">Solicitar Devolução</button>`;
        }
        
        return actions;
    }

    cancelOrder(orderId) {
        const reason = prompt('Motivo do cancelamento:');
        if (!reason) return;

        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            order.cancellationReason = reason;
            order.cancelledAt = new Date().toISOString();
            this.saveUserData();
            this.loadOrders();
            this.showToast('Pedido cancelado com sucesso', 'success');
        }
    }

    requestReturn(orderId) {
        const reason = prompt('Motivo da devolução:');
        if (!reason) return;

        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.returnRequested = true;
            order.returnReason = reason;
            order.returnRequestedAt = new Date().toISOString();
            this.saveUserData();
            this.loadOrders();
            this.showToast('Solicitação de devolução enviada', 'success');
        }
    }

    // ==================== PERFIL ====================

    loadProfile() {
        if (!this.currentUser) {
            this.showToast('Faça login para acessar o perfil', 'warning');
            this.showModal('loginModal');
            return;
        }

        document.getElementById('fullName').value = this.currentUser.fullName;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('profile').value = this.currentUser.profile;
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Tab`).classList.add('active');
        
        if (tab === 'addresses') {
            this.loadAddresses();
        }
    }

    updateProfile() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;

        if (!fullName || !email) {
            this.showToast('Preencha todos os campos', 'warning');
            return;
        }

        if (!this.validateFullName(fullName)) {
            this.showToast('Nome completo deve ter pelo menos 3 letras no nome e pelo menos 1 letra no sobrenome', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('E-mail inválido', 'error');
            return;
        }

        this.currentUser.fullName = fullName;
        this.currentUser.email = email;
        this.saveUserData();
        this.updateUserDisplay();
        this.showToast('Perfil atualizado com sucesso!', 'success');
    }

    updatePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showToast('Preencha todos os campos', 'warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showToast('Senhas não coincidem', 'warning');
            return;
        }

        if (!this.validatePassword(newPassword)) {
            this.showToast('Senha deve ter no mínimo 10 caracteres com números, letras e caracteres especiais', 'warning');
            return;
        }

        this.showToast('Senha alterada com sucesso!', 'success');
        document.getElementById('securityForm').reset();
    }

    // ==================== ENDEREÇOS ====================

    loadAddresses() {
        const container = document.getElementById('addressesList');
        container.innerHTML = '';

        if (this.addresses.length === 0) {
            container.innerHTML = '<p>Nenhum endereço cadastrado</p>';
            return;
        }

        this.addresses.forEach(address => {
            const addressCard = document.createElement('div');
            addressCard.className = 'address-card';
            addressCard.innerHTML = `
                <div class="address-type">${this.getAddressTypeLabel(address.type)}</div>
                <div class="address-info">
                    <p><strong>${address.street}, ${address.number}</strong></p>
                    <p>${address.complement ? address.complement + ', ' : ''}${address.neighborhood}</p>
                    <p>${address.city} - ${address.state}</p>
                    <p>CEP: ${address.cep}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-secondary" onclick="e2eCommerce.editAddress(${address.id})">Editar</button>
                    <button class="btn btn-danger" onclick="e2eCommerce.deleteAddress(${address.id})">Excluir</button>
                </div>
            `;
            container.appendChild(addressCard);
        });
    }

    showAddressModal(addressId = null) {
        const modal = document.getElementById('addressModal');
        const title = document.getElementById('addressModalTitle');
        const form = document.getElementById('addressForm');
        
        if (addressId) {
            const address = this.addresses.find(a => a.id === addressId);
            if (address) {
                title.textContent = 'Editar Endereço';
                document.getElementById('addressId').value = address.id;
                document.getElementById('addressType').value = address.type;
                document.getElementById('addressCep').value = address.cep;
                document.getElementById('addressStreet').value = address.street;
                document.getElementById('addressNumber').value = address.number;
                document.getElementById('addressComplement').value = address.complement || '';
                document.getElementById('addressNeighborhood').value = address.neighborhood;
                document.getElementById('addressCity').value = address.city;
                document.getElementById('addressState').value = address.state;
            }
        } else {
            title.textContent = 'Adicionar Endereço';
            form.reset();
            document.getElementById('addressId').value = '';
        }
        
        this.showModal('addressModal');
    }

    async lookupCEP() {
        const cep = document.getElementById('addressCep').value.replace(/\D/g, '');
        
        if (cep.length !== 8) return;
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                document.getElementById('addressStreet').value = data.logradouro;
                document.getElementById('addressNeighborhood').value = data.bairro;
                document.getElementById('addressCity').value = data.localidade;
                document.getElementById('addressState').value = data.uf;
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }

    saveAddress() {
        const id = document.getElementById('addressId').value;
        const type = document.getElementById('addressType').value;
        const cep = document.getElementById('addressCep').value;
        const street = document.getElementById('addressStreet').value;
        const number = document.getElementById('addressNumber').value;
        const complement = document.getElementById('addressComplement').value;
        const neighborhood = document.getElementById('addressNeighborhood').value;
        const city = document.getElementById('addressCity').value;
        const state = document.getElementById('addressState').value;

        if (!type || !cep || !street || !number || !neighborhood || !city || !state) {
            this.showToast('Preencha todos os campos obrigatórios', 'warning');
            return;
        }

        // Verificar limite de 3 endereços
        if (!id && this.addresses.length >= 3) {
            this.showToast('Máximo de 3 endereços permitidos', 'warning');
            return;
        }

        const addressData = {
            id: id || Date.now(),
            type,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        };

        if (id) {
            const index = this.addresses.findIndex(a => a.id == id);
            if (index !== -1) {
                this.addresses[index] = addressData;
            }
        } else {
            this.addresses.push(addressData);
        }

        this.saveUserData();
        this.loadAddresses();
        this.hideModal('addressModal');
        this.showToast('Endereço salvo com sucesso!', 'success');
    }

    editAddress(addressId) {
        this.showAddressModal(addressId);
    }

    deleteAddress(addressId) {
        if (confirm('Deseja realmente excluir este endereço?')) {
            this.addresses = this.addresses.filter(a => a.id !== addressId);
            this.saveUserData();
            this.loadAddresses();
            this.showToast('Endereço excluído com sucesso!', 'success');
        }
    }

    // ==================== UTILITÁRIOS ====================

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ==================== PWA FUNCTIONS ====================

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Instalar PWA
    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    this.showToast('App instalado com sucesso!', 'success');
                }
                this.deferredPrompt = null;
            });
        }
    }

    // Detectar prompt de instalação
    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Mostrar botão de instalação no header
            const installBtn = document.createElement('button');
            installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
            installBtn.className = 'btn btn-secondary';
            installBtn.style.marginLeft = '1rem';
            installBtn.onclick = () => this.installPWA();
            
            const headerActions = document.querySelector('.header-actions');
            headerActions.appendChild(installBtn);
        });

        // Detectar se foi instalado
        window.addEventListener('appinstalled', () => {
            this.showToast('App instalado com sucesso!', 'success');
        });
    }

    // Função de debug para limpar dados
    clearAllData() {
        if (confirm('Deseja limpar todos os dados? Isso fará logout e limpará o carrinho.')) {
            this.clearUserData();
            this.clearLocalStorage();
            this.showToast('Todos os dados foram limpos!', 'success');
            window.location.reload();
        }
    }
}

// Inicializar aplicação
const e2eCommerce = new E2ECommerce();

// Funções de debug globais
window.clearAllData = () => e2eCommerce.clearAllData();
window.debugUserData = () => {
    console.log('Current User:', e2eCommerce.currentUser);
    console.log('LocalStorage:', localStorage.getItem('e2e_user_data'));
    console.log('Session Timestamp:', localStorage.getItem('e2e_session_timestamp'));
};

// Formatação de cartão
document.addEventListener('DOMContentLoaded', function() {
    // Formatação do número do cartão
    const cardNumberInputs = ['cardNumber', 'debitCardNumber'];
    cardNumberInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }
    });

    // Formatação da data de validade
    const expiryInputs = ['cardExpiry', 'debitCardExpiry'];
    expiryInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    });

    // Formatação do CEP
    const cepInput = document.getElementById('addressCep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
});
