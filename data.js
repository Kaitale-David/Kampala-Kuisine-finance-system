// ============================================
// DATA STORAGE & MOCK DATABASE
// ============================================

class DataStore {
    constructor() {
        this.storageKey = 'kampala_finance_data';
        this.init();
    }
    
    init() {
        // Initialize data structure if not exists
        if (!localStorage.getItem(this.storageKey)) {
            this.initializeData();
        }
    }
    
    initializeData() {
        const initialData = {
            users: {
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
                }
            },
            transactions: this.generateMockTransactions(),
            debtors: this.generateMockDebtors(),
            inventory: this.generateMockInventory(),
            financials: this.generateMockFinancials(),
            settings: {
                restaurantName: "Kampala Kuisine",
                themeColor: "green",
                currency: "USD",
                taxRate: 16,
                serviceCharge: 10
            },
            lastUpdated: new Date().toISOString()
        };
        
        this.saveData(initialData);
    }
    
    generateMockTransactions() {
        const transactions = [];
        const types = ['sale', 'expense', 'payment', 'refund'];
        const categories = ['food', 'beverage', 'supplies', 'utilities', 'salary', 'rent'];
        const paymentMethods = ['cash', 'card', 'mobile', 'glovo'];
        
        // Generate 50 mock transactions for the last 30 days
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            const amount = (Math.random() * 200 + 10).toFixed(2);
            const type = types[Math.floor(Math.random() * types.length)];
            
            transactions.push({
                id: `TRX-${1000 + i}`,
                date: date.toISOString().split('T')[0],
                time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
                type: type,
                category: categories[Math.floor(Math.random() * categories.length)],
                description: `Transaction ${i + 1}`,
                amount: parseFloat(amount),
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                reference: `REF-${Math.floor(Math.random() * 10000)}`,
                recordedBy: Math.random() > 0.5 ? 'john' : 'mary'
            });
        }
        
        return transactions;
    }
    
    generateMockDebtors() {
        return [
            {
                id: "DBT-001",
                name: "Corporate Catering Ltd",
                contact: "0712 345 678",
                email: "accounts@corporatecatering.co.ke",
                totalDebt: 1500.00,
                amountPaid: 500.00,
                balance: 1000.00,
                dueDate: "2024-01-25",
                status: "pending",
                notes: "Regular corporate client"
            },
            {
                id: "DBT-002",
                name: "Events Company",
                contact: "0733 987 654",
                email: "finance@eventscompany.co.ke",
                totalDebt: 850.00,
                amountPaid: 0.00,
                balance: 850.00,
                dueDate: "2024-01-28",
                status: "pending",
                notes: "Wedding event catering"
            },
            {
                id: "DBT-003",
                name: "Tech Startup Office",
                contact: "0701 234 567",
                email: "office@techstartup.co.ke",
                totalDebt: 2300.00,
                amountPaid: 2300.00,
                balance: 0.00,
                dueDate: "2024-01-15",
                status: "paid",
                notes: "Monthly office lunch subscription"
            }
        ];
    }
    
    generateMockInventory() {
        const categories = ['meat', 'vegetables', 'dairy', 'beverages', 'dry goods', 'spices'];
        
        return categories.map((category, index) => ({
            id: `INV-${100 + index}`,
            name: this.getRandomItemName(category),
            category: category,
            currentStock: Math.floor(Math.random() * 100) + 10,
            unit: this.getUnitForCategory(category),
            reorderLevel: 20,
            idealStock: 50,
            supplier: this.getRandomSupplier(),
            lastRestocked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            costPerUnit: (Math.random() * 10 + 1).toFixed(2)
        }));
    }
    
    getRandomItemName(category) {
        const items = {
            'meat': ['Beef Tenderloin', 'Chicken Breast', 'Pork Chops', 'Lamb Rack'],
            'vegetables': ['Tomatoes', 'Onions', 'Bell Peppers', 'Lettuce', 'Carrots'],
            'dairy': ['Milk', 'Cheese', 'Butter', 'Yogurt'],
            'beverages': ['Soda', 'Juice', 'Coffee Beans', 'Tea Leaves'],
            'dry goods': ['Rice', 'Flour', 'Sugar', 'Pasta'],
            'spices': ['Salt', 'Pepper', 'Paprika', 'Cumin']
        };
        
        return items[category][Math.floor(Math.random() * items[category].length)];
    }
    
    getUnitForCategory(category) {
        const units = {
            'meat': 'kg',
            'vegetables': 'kg',
            'dairy': 'liters',
            'beverages': 'bottles',
            'dry goods': 'kg',
            'spices': 'grams'
        };
        
        return units[category] || 'units';
    }
    
    getRandomSupplier() {
        const suppliers = ['Nakumatt', 'Tuskys', 'GreenGrocers Ltd', 'FreshDirect', 'Local Market'];
        return suppliers[Math.floor(Math.random() * suppliers.length)];
    }
    
    generateMockFinancials() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return months.map((month, index) => ({
            month: month,
            year: 2024,
            revenue: Math.floor(Math.random() * 50000) + 30000,
            expenses: Math.floor(Math.random() * 30000) + 20000,
            profit: 0, // Will be calculated
            foodCostPercent: (Math.random() * 10 + 25).toFixed(1),
            laborCostPercent: (Math.random() * 10 + 20).toFixed(1),
            glovoOrders: Math.floor(Math.random() * 100) + 50,
            glovoRevenue: Math.floor(Math.random() * 15000) + 5000
        })).map(item => ({
            ...item,
            profit: item.revenue - item.expenses
        }));
    }
    
    // CRUD Operations
    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }
    
    saveData(data) {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    // Transaction Methods
    getTransactions(filter = {}) {
        const data = this.getData();
        let transactions = data?.transactions || [];
        
        // Apply filters
        if (filter.date) {
            transactions = transactions.filter(t => t.date === filter.date);
        }
        
        if (filter.type) {
            transactions = transactions.filter(t => t.type === filter.type);
        }
        
        if (filter.category) {
            transactions = transactions.filter(t => t.category === filter.category);
        }
        
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    addTransaction(transaction) {
        const data = this.getData();
        if (!data) return false;
        
        transaction.id = `TRX-${Date.now()}`;
        transaction.date = new Date().toISOString().split('T')[0];
        transaction.time = new Date().toLocaleTimeString('en-US', { hour12: true });
        
        data.transactions.unshift(transaction);
        this.saveData(data);
        return true;
    }
    
    // Debtor Methods
    getDebtors() {
        const data = this.getData();
        return data?.debtors || [];
    }
    
    updateDebtor(id, updates) {
        const data = this.getData();
        if (!data) return false;
        
        const index = data.debtors.findIndex(d => d.id === id);
        if (index === -1) return false;
        
        data.debtors[index] = { ...data.debtors[index], ...updates };
        
        // Auto-update balance
        if (updates.amountPaid !== undefined) {
            data.debtors[index].balance = data.debtors[index].totalDebt - updates.amountPaid;
            
            // Update status based on balance
            if (data.debtors[index].balance <= 0) {
                data.debtors[index].status = 'paid';
            } else if (data.debtors[index].balance < data.debtors[index].totalDebt) {
                data.debtors[index].status = 'partial';
            }
        }
        
        this.saveData(data);
        return true;
    }
    
    // Inventory Methods
    getInventory() {
        const data = this.getData();
        return data?.inventory || [];
    }
    
    updateInventoryItem(id, updates) {
        const data = this.getData();
        if (!data) return false;
        
        const index = data.inventory.findIndex(item => item.id === id);
        if (index === -1) return false;
        
        data.inventory[index] = { ...data.inventory[index], ...updates };
        this.saveData(data);
        return true;
    }
    
    // Financial Methods
    getFinancials() {
        const data = this.getData();
        return data?.financials || [];
    }
    
    // User Methods
    getUser(username) {
        const data = this.getData();
        return data?.users?.[username] || null;
    }
    
    updateUser(username, updates) {
        const data = this.getData();
        if (!data || !data.users[username]) return false;
        
        data.users[username] = { ...data.users[username], ...updates };
        this.saveData(data);
        return true;
    }
    
    // Settings Methods
    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }
    
    updateSettings(newSettings) {
        const data = this.getData();
        if (!data) return false;
        
        data.settings = { ...data.settings, ...newSettings };
        this.saveData(data);
        return true;
    }
    
    // Export/Import
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    }
    
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
    
    // Backup/Restore
    createBackup() {
        const data = this.getData();
        const backup = {
            ...data,
            backedUpAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kampala-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        return backup;
    }
    
    restoreBackup(backupData) {
        try {
            const backup = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
            
            // Validate backup structure
            if (!backup.users || !backup.transactions || !backup.settings) {
                throw new Error('Invalid backup format');
            }
            
            this.saveData(backup);
            return true;
        } catch (error) {
            console.error('Restore failed:', error);
            return false;
        }
    }
}

// Create global instance
const dataStore = new DataStore();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { dataStore };
}