// Cloudflare API Integration for E2E-Commerce Frontend
// This file replaces the local authentication system with Cloudflare API calls

class CloudflareAuth {
    constructor() {
        // Configurar URL da API baseada no ambiente
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.apiBaseUrl = 'http://localhost:8787'; // Local development
        } else if (window.location.hostname.includes('github.io')) {
            this.apiBaseUrl = 'https://api.e2ecommerce.com'; // Production Cloudflare
        } else {
            this.apiBaseUrl = 'https://api.e2ecommerce.com'; // Default production
        }
        this.token = localStorage.getItem('e2e_jwt_token');
    }

    // ==================== AUTHENTICATION METHODS ====================

    async register(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.fullName,
                    email: userData.email,
                    password: userData.password,
                    profile: userData.profile || 'client'
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Save token and user data
                this.token = result.token;
                localStorage.setItem('e2e_jwt_token', this.token);
                localStorage.setItem('e2e_user_data', JSON.stringify(result.user));
                
                return {
                    success: true,
                    user: result.user,
                    token: result.token
                };
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                // Save token and user data
                this.token = result.token;
                localStorage.setItem('e2e_jwt_token', this.token);
                localStorage.setItem('e2e_user_data', JSON.stringify(result.user));
                
                return {
                    success: true,
                    user: result.user,
                    token: result.token
                };
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async logout() {
        try {
            if (this.token) {
                // Call logout endpoint
                await fetch(`${this.apiBaseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }

            // Clear local data
            this.token = null;
            localStorage.removeItem('e2e_jwt_token');
            localStorage.removeItem('e2e_user_data');
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear local data
            this.token = null;
            localStorage.removeItem('e2e_jwt_token');
            localStorage.removeItem('e2e_user_data');
            return { success: true };
        }
    }

    async getCurrentUser() {
        try {
            if (!this.token) {
                return { success: false, error: 'No token available' };
            }

            const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    user: result.user
                };
            } else {
                // Token might be expired, clear it
                this.token = null;
                localStorage.removeItem('e2e_jwt_token');
                localStorage.removeItem('e2e_user_data');
                return {
                    success: false,
                    error: 'Token expired or invalid'
                };
            }
        } catch (error) {
            console.error('Get user error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ==================== USER MANAGEMENT ====================

    async updateProfile(userData) {
        try {
            if (!this.token) {
                return { success: false, error: 'No token available' };
            }

            const response = await fetch(`${this.apiBaseUrl}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    name: userData.fullName,
                    email: userData.email
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Update local storage
                localStorage.setItem('e2e_user_data', JSON.stringify(result.user));
                return {
                    success: true,
                    user: result.user
                };
            } else {
                throw new Error(result.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.token) {
                return { success: false, error: 'No token available' };
            }

            const response = await fetch(`${this.apiBaseUrl}/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                throw new Error(result.message || 'Password change failed');
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteAccount() {
        try {
            if (!this.token) {
                return { success: false, error: 'No token available' };
            }

            const response = await fetch(`${this.apiBaseUrl}/users/account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                // Clear local data
                this.token = null;
                localStorage.removeItem('e2e_jwt_token');
                localStorage.removeItem('e2e_user_data');
                return { success: true };
            } else {
                throw new Error(result.message || 'Account deletion failed');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ==================== UTILITY METHODS ====================

    isLoggedIn() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getStoredUser() {
        const userData = localStorage.getItem('e2e_user_data');
        return userData ? JSON.parse(userData) : null;
    }

    // Check if token is expired (basic check)
    isTokenExpired() {
        if (!this.token) return true;
        
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            return payload.exp && payload.exp < Date.now() / 1000;
        } catch (error) {
            return true;
        }
    }

    // Refresh token if needed
    async refreshTokenIfNeeded() {
        if (this.isTokenExpired()) {
            const result = await this.getCurrentUser();
            if (!result.success) {
                await this.logout();
                return false;
            }
        }
        return true;
    }
}

// ==================== INTEGRATION WITH EXISTING CODE ====================

// Replace the existing E2ECommerce class methods with Cloudflare API calls
class E2ECommerceCloudflare extends E2ECommerce {
    constructor() {
        super();
        this.cloudflareAuth = new CloudflareAuth();
    }

    // Override authentication methods
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Preencha todos os campos', 'warning');
            return;
        }

        try {
            this.showLoading();
            const result = await this.cloudflareAuth.login(email, password);
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUserDisplay();
                this.hideModal('loginModal');
                this.showToast('Login realizado com sucesso!', 'success');
                this.resetSessionTimer();
            } else {
                this.showToast(result.error || 'E-mail ou senha incorretos', 'error');
            }
        } catch (error) {
            this.showToast('Erro ao fazer login', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister() {
        const fullName = document.getElementById('registerFullName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const profile = document.getElementById('registerProfile').value;

        // Validation
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
            const result = await this.cloudflareAuth.register({
                fullName,
                email,
                password,
                profile
            });
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUserDisplay();
                this.hideModal('registerModal');
                this.showToast('Cadastro realizado com sucesso!', 'success');
                this.resetSessionTimer();
            } else {
                this.showToast(result.error || 'Erro ao criar conta', 'error');
            }
        } catch (error) {
            this.showToast('Erro ao criar conta', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async logout() {
        this.showLogoutModal();
    }

    async confirmLogout() {
        try {
            const result = await this.cloudflareAuth.logout();
            
            if (result.success) {
                this.clearUserData();
                this.clearSessionTimer();
                this.hideModal('logoutModal');
                this.showToast('Logout realizado com sucesso!', 'success');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showToast('Erro ao fazer logout', 'error');
            }
        } catch (error) {
            this.showToast('Erro ao fazer logout', 'error');
        }
    }

    async updateProfile() {
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

        try {
            this.showLoading();
            const result = await this.cloudflareAuth.updateProfile({
                fullName,
                email
            });
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUserDisplay();
                this.showToast('Perfil atualizado com sucesso!', 'success');
            } else {
                this.showToast(result.error || 'Erro ao atualizar perfil', 'error');
            }
        } catch (error) {
            this.showToast('Erro ao atualizar perfil', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async updatePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showToast('Preencha todos os campos', 'warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showToast('Senhas não coincidem', 'error');
            return;
        }

        if (!this.validatePassword(newPassword)) {
            this.showToast('Nova senha deve ter no mínimo 10 caracteres com números, letras e caracteres especiais', 'error');
            return;
        }

        try {
            this.showLoading();
            const result = await this.cloudflareAuth.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                this.showToast('Senha alterada com sucesso!', 'success');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                this.showToast(result.error || 'Erro ao alterar senha', 'error');
            }
        } catch (error) {
            this.showToast('Erro ao alterar senha', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Override loadUserData to use Cloudflare API
    async loadUserData() {
        // Check if we have a stored token
        const token = localStorage.getItem('e2e_jwt_token');
        if (token) {
            this.cloudflareAuth.token = token;
            
            // Verify token is still valid
            const result = await this.cloudflareAuth.getCurrentUser();
            if (result.success) {
                this.currentUser = result.user;
                this.updateUserDisplay();
            } else {
                // Token is invalid, clear it
                await this.cloudflareAuth.logout();
            }
        }
        
        // Load other data from localStorage
        this.cart = JSON.parse(localStorage.getItem('e2e_cart') || '[]');
        this.orders = JSON.parse(localStorage.getItem('e2e_orders') || '[]');
        this.addresses = JSON.parse(localStorage.getItem('e2e_addresses') || '[]');
    }
}

// Export for use
window.CloudflareAuth = CloudflareAuth;
window.E2ECommerceCloudflare = E2ECommerceCloudflare;
