// ============================================
// KAMPALA KUISINE - AUTHENTICATION SYSTEM
// ============================================

// User Database (In production, this would be on a server)
const USERS = {
    "john": {
        password: "john123",
        name: "John Kamau",
        role: "owner",
        email: "john@kampalakuisine.com",
        ownership: 60,
        investment: 25000,
        avatar: "JK",
        permissions: ["dashboard", "financials", "decisions", "staff", "inventory", "settings"]
    },
    "mary": {
        password: "mary456",
        name: "Mary Wanjiku",
        role: "owner",
        email: "mary@kampalakuisine.com",
        ownership: 40,
        investment: 15000,
        avatar: "MW",
        permissions: ["dashboard", "financials", "decisions", "suppliers", "marketing", "settings"]
    },
    "manager": {
        password: "manager789",
        name: "James Omondi",
        role: "manager",
        email: "james@kampalakuisine.com",
        ownership: 0,
        investment: 0,
        avatar: "JO",
        permissions: ["dashboard", "daily_ops", "staff", "inventory", "reports"]
    },
    "chef": {
        password: "chef123",
        name: "Chef Wambui",
        role: "staff",
        email: "chef@kampalakuisine.com",
        avatar: "CW",
        permissions: ["inventory", "orders", "reports"]
    }
};

// Session Management
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }
    
    init() {
        // Check for existing session
        const savedSession = localStorage.getItem('kampala_session');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            const now = Date.now();
            
            if (session.expires > now && this.validateSession(session)) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.startSessionTimer();
                console.log('Session restored:', this.currentUser.name);
            } else {
                localStorage.removeItem('kampala_session');
            }
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Password visibility toggle
        const showPasswordBtn = document.getElementById('showPassword');
        if (showPasswordBtn) {
            showPasswordBtn.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    showPasswordBtn.textContent = '🙈';
                } else {
                    passwordInput.type = 'password';
                    showPasswordBtn.textContent = '👁️';
                }
            });
        }
        
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Auto-fill demo credentials for testing
        this.setupDemoAutoFill();
    }
    
    setupDemoAutoFill() {
        // Quick test buttons for development
        const demoCredentials = document.createElement('div');
        demoCredentials.className = 'demo-quick-login';
        demoCredentials.innerHTML = `
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="auth.quickLogin('john')" style="padding: 8px 12px; background: var(--emerald-green); color: white; border: none; border-radius: 6px; cursor: pointer;">Login as John</button>
                <button onclick="auth.quickLogin('mary')" style="padding: 8px 12px; background: var(--sage-green); color: white; border: none; border-radius: 6px; cursor: pointer;">Login as Mary</button>
                <button onclick="auth.quickLogin('manager')" style="padding: 8px 12px; background: var(--lime-green); color: var(--text-dark); border: none; border-radius: 6px; cursor: pointer;">Login as Manager</button>
            </div>
        `;
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.appendChild(demoCredentials);
        }
    }
    
    quickLogin(username) {
        const user = USERS[username];
        if (user) {
            document.getElementById('username').value = username;
            document.getElementById('password').value = user.password;
            this.handleLogin();
        }
    }
    
    handleLogin() {
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Show loading
        this.showLoading(true);
        
        // Simulate network delay
        setTimeout(() => {
            const user = this.authenticate(username, password);
            
            if (user) {
                this.loginSuccess(user, rememberMe);
            } else {
                this.loginFailed();
            }
            
            this.showLoading(false);
        }, 800);
    }
    
    authenticate(username, password) {
        const user = USERS[username];
        
        if (user && user.password === password) {
            return {
                username: username,
                name: user.name,
                role: user.role,
                email: user.email,
                ownership: user.ownership,
                investment: user.investment,
                avatar: user.avatar,
                permissions: user.permissions,
                loginTime: new Date().toISOString()
            };
        }
        
        return null;
    }
    
    loginSuccess(user, rememberMe) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Create session
        const session = {
            user: user,
            created: Date.now(),
            expires: Date.now() + this.sessionTimeout
        };
        
        // Store session
        if (rememberMe) {
            localStorage.setItem('kampala_session', JSON.stringify(session));
        } else {
            sessionStorage.setItem('kampala_session', JSON.stringify(session));
        }
        
        // Start session timer
        this.startSessionTimer();
        
        // Show success message
        this.showMessage('success', `Welcome back, ${user.name}!`, 2000);
        
        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
    
    loginFailed() {
        this.showMessage('error', 'Invalid username or password. Please try again.', 3000);
        
        // Shake animation for error
        const loginForm = document.getElementById('loginForm');
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }
    
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear session
        localStorage.removeItem('kampala_session');
        sessionStorage.removeItem('kampala_session');
        
        // Redirect to login
        window.location.href = 'index.html';
    }
    
    validateSession(session) {
        // Additional session validation could go here
        return session && session.user && session.expires > Date.now();
    }
    
    startSessionTimer() {
        // Auto-logout after session timeout
        setTimeout(() => {
            if (this.isAuthenticated) {
                this.showMessage('warning', 'Session expired. Please login again.', 3000);
                this.logout();
            }
        }, this.sessionTimeout);
    }
    
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = show ? '1' : '0';
            loadingOverlay.style.pointerEvents = show ? 'all' : 'none';
            
            if (!show) {
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }
    }
    
    showMessage(type, text, duration = 3000) {
        // Remove existing messages
        const existingMsg = document.querySelector('.auth-message');
        if (existingMsg) existingMsg.remove();
        
        // Create message element
        const message = document.createElement('div');
        message.className = `auth-message auth-message-${type}`;
        message.innerHTML = `
            <div class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</div>
            <div class="message-text">${text}</div>
        `;
        
        // Add styles
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--warning)'};
            color: white;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: var(--shadow-medium);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(message);
        
        // Auto-remove after duration
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, duration);
    }
    
    checkPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isOwner() {
        return this.currentUser && this.currentUser.role === 'owner';
    }
    
    isManager() {
        return this.currentUser && this.currentUser.role === 'manager';
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Add shake animation to CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
</style>
`);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, USERS };

    // ============================================
// FIX FOR GITHUB PAGES - AUTO-HIDE LOADING
// ============================================

// Force hide loading overlay on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, hiding loading overlay...');
    
    // Hide loading immediately
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
    
    // Check if we should auto-login
    const savedSession = localStorage.getItem('kampala_session');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            if (session.expires > Date.now()) {
                // Auto-redirect to dashboard
                console.log('Auto-login detected, redirecting...');
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 500);
            }
        } catch (e) {
            console.error('Session parse error:', e);
        }
    }
});

// Fix for GitHub Pages navigation
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Final safety: hide loading overlay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay && loadingOverlay.style.display !== 'none') {
            loadingOverlay.style.display = 'none';
            console.log('Loading overlay force-hidden');
        }
    }, 1000);
});

}
