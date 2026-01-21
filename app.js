// ============================================
// MAIN APPLICATION LOGIC - FIXED FOR GITHUB PAGES
// ============================================

class KampalaFinanceApp {
    constructor() {
        this.init();
    }
    
    init() {
        // IMMEDIATELY hide loading overlay
        this.hideLoadingOverlay();
        
        // Check if we're on login page or dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            // Dashboard initialization handled in dashboard.js
            console.log('Dashboard page loaded');
            return;
        }
        
        // Login page initialization
        this.setupLoginPage();
    }
    
    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            // Hide immediately
            loadingOverlay.style.display = 'none';
            loadingOverlay.style.opacity = '0';
            
            // Also remove from DOM after a bit
            setTimeout(() => {
                if (loadingOverlay && loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 500);
        }
    }
    
    setupLoginPage() {
        console.log('Kampala Kuisine Login Page Ready');
        
        // Already handled by auth.js, just add some effects
        setTimeout(() => {
            this.addLoginPageEffects();
        }, 100);
    }
    
    addLoginPageEffects() {
        // Add floating particles effect (optional)
        this.createFloatingParticles();
        
        // Add typing effect to tagline
        this.animateTagline();
    }
    
    createFloatingParticles() {
        const container = document.querySelector('.brand-section');
        if (!container) return;
        
        const particles = ['🍽️', '💰', '📊', '📈', '💸', '💳', '💵', '💎'];
        
        for (let i = 0; i < 10; i++) {
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
                pointer-events: none;
            `;
            
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
                setTimeout(typeWriter, 30);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 500);
    }
}

// Initialize app with timeout protection
window.addEventListener('DOMContentLoaded', () => {
    // Force hide loading after 3 seconds max (safety net)
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }, 3000);
    
    // Initialize app
    const kampalaApp = new KampalaFinanceApp();
});

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

// Make auth globally available
if (typeof auth === 'undefined') {
    console.warn('auth.js not loaded yet');
}
