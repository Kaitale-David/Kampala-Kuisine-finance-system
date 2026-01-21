// ============================================
// MAIN APPLICATION LOGIC
// ============================================

class KampalaFinanceApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if we're on login page or dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            // Dashboard-specific initialization is handled in dashboard.js
            return;
        }
        
        // Login page initialization
        this.setupLoginPage();
        
        // Check for auto-login
        this.checkAutoLogin();
    }
    
    setupLoginPage() {
        // Already handled by auth.js
        console.log('Kampala Kuisine Financial System initialized');
        
        // Add some interactive effects
        this.addLoginPageEffects();
    }
    
    addLoginPageEffects() {
        // Add floating particles effect
        this.createFloatingParticles();
        
        // Add typing effect to tagline
        this.animateTagline();
    }
    
    createFloatingParticles() {
        const container = document.querySelector('.brand-section');
        if (!container) return;
        
        const particles = ['🍽️', '💰', '📊', '📈', '💸', '💳', '💵', '💎'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 10}px;
                opacity: ${Math.random() * 0.3 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                z-index: 0;
            `;
            
            // Add animation
            const style = document.createElement('style');
            if (!document.getElementById('float-animation')) {
                style.id = 'float-animation';
                style.textContent = `
                    @keyframes float {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        25% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(90deg); }
                        50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(180deg); }
                        75% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(270deg); }
                        100% { transform: translate(0, 0) rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            container.appendChild(particle);
        }
    }
    
    animateTagline() {
        const tagline = document.querySelector('.tagline');
        if (!tagline) return;
        
        const originalText = tagline.textContent;
        tagline.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                tagline.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }
    
    checkAutoLogin() {
        // Check if user should be auto-logged in
        const rememberMe = localStorage.getItem('kampala_remember') === 'true';
        const savedUser = localStorage.getItem('kampala_user');
        
        if (rememberMe && savedUser) {
            // Auto-fill username
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = savedUser;
                document.getElementById('rememberMe').checked = true;
            }
        }
    }
}

// Initialize app
const kampalaApp = new KampalaFinanceApp();

// Global utility functions
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 
                    type === 'error' ? 'var(--danger)' : 
                    type === 'warning' ? 'var(--warning)' : 'var(--info)'};
        color: white;
        padding: 12px 24px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Add animations if not already present
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}