// ============================================
// DASHBOARD FUNCTIONALITY
// ============================================

class Dashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }
    
    init() {
        // Check authentication
        if (!auth.isAuthenticated) {
            window.location.href = 'index.html';
            return;
        }
        
        // Update UI with user data
        this.updateUserInfo();
        
        // Set up navigation
        this.setupNavigation();
        
        // Update date and time
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000); // Update every minute
        
        // Set up notifications
        this.setupNotifications();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load dashboard data
        this.loadDashboardData();
    }
    
    updateUserInfo() {
        const user = auth.getCurrentUser();
        if (!user) return;
        
        // Update user info in sidebar
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.avatar;
        document.getElementById('userRole').textContent = user.role === 'owner' ? 'Owner Dashboard' : 'Manager Dashboard';
        document.getElementById('welcomeName').textContent = user.name.split(' ')[0];
        
        // Update ownership badge
        const badge = document.getElementById('ownershipBadge');
        if (user.ownership > 0) {
            badge.textContent = `${user.ownership}% Owner`;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    updateDateTime() {
        const now = new Date();
        
        // Format date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
        
        // Format time
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Set initial active page
        this.navigateTo(this.currentPage);
    }
    
    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`page-${page}`);
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = page;
            
            // Update page title
            document.title = `${this.getPageTitle(page)} | Kampala Kuisine`;
            
            // Load page-specific data
            this.loadPageData(page);
        }
    }
    
    getPageTitle(page) {
        const titles = {
            'dashboard': 'Dashboard',
            'financials': 'Financial Reports',
            'transactions': 'Transactions',
            'debtors': 'Debtors & Creditors',
            'inventory': 'Inventory Management',
            'payroll': 'Payroll',
            'glovo': 'Glovo Analytics',
            'decisions': 'Joint Decisions',
            'settings': 'Settings'
        };
        return titles[page] || 'Dashboard';
    }
    
    loadPageData(page) {
        switch(page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'financials':
                this.loadFinancialReports();
                break;
            case 'debtors':
                this.loadDebtorsData();
                break;
            // Add more cases as needed
        }
    }
    
    loadDashboardData() {
        // This would normally fetch from an API
        // For now, we'll simulate with mock data
        
        const user = auth.getCurrentUser();
        
        // Update today's stats
        const today = new Date();
        const stats = this.getMockStatsForDate(today);
        
        document.getElementById('todayRevenue').textContent = 
            `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('activeTables').textContent = stats.activeTables;
        document.getElementById('onlineOrders').textContent = stats.onlineOrders;
    }
    
    getMockStatsForDate(date) {
        // Mock data - in real system, this would come from a database
        return {
            revenue: 2450.75,
            activeTables: 12,
            onlineOrders: 8,
            totalTransactions: 42,
            averageOrder: 58.35
        };
    }
    
    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        
        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener('click', () => {
                notificationPanel.classList.toggle('active');
            });
        }
    }
    
    setupEventListeners() {
        // Menu toggle for mobile
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
        
        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            const notificationPanel = document.getElementById('notificationPanel');
            const notificationBtn = document.getElementById('notificationBtn');
            
            if (notificationPanel && notificationPanel.classList.contains('active') &&
                !notificationPanel.contains(e.target) && 
                !notificationBtn.contains(e.target)) {
                notificationPanel.classList.remove('active');
            }
        });
        
        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('onclick')?.match(/quickAction\('(.+?)'\)/)?.[1];
                if (action) {
                    this.handleQuickAction(action);
                }
            });
        });
    }
    
    handleQuickAction(action) {
        const actions = {
            'addTransaction': () => this.showModal('Add Transaction'),
            'generateReport': () => this.generateDailyReport(),
            'addExpense': () => this.showModal('Add Expense'),
            'recordPayment': () => this.showModal('Record Payment'),
            'checkInventory': () => this.navigateTo('inventory'),
            'viewReports': () => this.navigateTo('financials')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    showModal(title) {
        // Create modal HTML
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p>This feature would open a form for ${title.toLowerCase()}.</p>
                    <p>In the full system, this would include form fields, validation, and submission.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-primary" onclick="this.closest('.modal-overlay').remove(); dashboard.showMessage('${title} recorded successfully!')">Save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking X or outside
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Add modal styles
        this.addModalStyles();
    }
    
    addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal {
                    background: white;
                    border-radius: var(--border-radius-lg);
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow: auto;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-header {
                    padding: var(--space-lg);
                    border-bottom: var(--border-light);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    margin: 0;
                    color: var(--forest-green);
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-muted);
                }
                
                .modal-body {
                    padding: var(--space-lg);
                }
                
                .modal-footer {
                    padding: var(--space-lg);
                    border-top: var(--border-light);
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--space-md);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    generateDailyReport() {
        const user = auth.getCurrentUser();
        const date = new Date().toLocaleDateString();
        
        // In real system, this would generate a PDF or CSV
        const reportData = {
            date: date,
            generatedBy: user.name,
            revenue: "$2,450.75",
            transactions: 42,
            averageOrder: "$58.35",
            topItems: ["Signature Burger", "Tropical Smoothie", "Fries"],
            notes: "Business as usual. No major incidents."
        };
        
        this.showMessage(`Daily report for ${date} generated successfully! Check your downloads folder.`);
        
        // Simulate download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
            link.download = `kampala-report-${date.replace(/\//g, '-')}.json`;
            link.click();
        }, 1000);
    }
    
    showMessage(text, type = 'success') {
        // Reuse auth system's message function
        auth.showMessage(type, text);
    }
    
    loadFinancialReports() {
        // This would load financial data from API
        console.log('Loading financial reports...');
    }
    
    loadDebtorsData() {
        // This would load debtors data from API
        console.log('Loading debtors data...');
    }
}

// Global functions for HTML onclick handlers
function navigateTo(page) {
    dashboard.navigateTo(page);
}

function quickAction(action) {
    dashboard.handleQuickAction(action);
}

function closeNotifications() {
    document.getElementById('notificationPanel').classList.remove('active');
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});