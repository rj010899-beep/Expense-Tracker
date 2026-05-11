// IndexedDB Database Manager
class ExpenseDB {
    constructor() {
        this.dbName = 'ExpenseTrackerDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create Object Stores
                if (!db.objectStoreNames.contains('expenses')) {
                    const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
                    expenseStore.createIndex('date', 'date', { unique: false });
                    expenseStore.createIndex('category', 'category', { unique: false });
                    expenseStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('categories')) {
                    db.createObjectStore('categories', { keyPath: 'name' });
                }

                if (!db.objectStoreNames.contains('budgets')) {
                    db.createObjectStore('budgets', { keyPath: 'category' });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                if (!db.objectStoreNames.contains('recurringExpenses')) {
                    db.createObjectStore('recurringExpenses', { keyPath: 'id' });
                }
            };
        });
    }

    // EXPENSES OPERATIONS
    async addExpense(expense) {
        const transaction = this.db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        
        expense.id = 'exp_' + Date.now() + Math.random().toString(36).substr(2, 9);
        expense.timestamp = Date.now();
        
        return new Promise((resolve, reject) => {
            const request = store.add(expense);
            request.onsuccess = () => resolve(expense.id);
            request.onerror = () => reject(request.error);
        });
    }

    async updateExpense(id, expense) {
        const transaction = this.db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        
        expense.id = id;
        expense.updatedAt = Date.now();
        
        return new Promise((resolve, reject) => {
            const request = store.put(expense);
            request.onsuccess = () => resolve(id);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteExpense(id) {
        const transaction = this.db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getExpense(id) {
        const transaction = this.db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllExpenses() {
        const transaction = this.db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getExpensesByMonth(year, month) {
        const expenses = await this.getAllExpenses();
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        
        return expenses.filter(exp => exp.date.startsWith(monthStr));
    }

    async getExpensesByCategory(category) {
        const expenses = await this.getAllExpenses();
        return expenses.filter(exp => exp.category === category);
    }

    async getExpensesByDateRange(startDate, endDate) {
        const expenses = await this.getAllExpenses();
        return expenses.filter(exp => exp.date >= startDate && exp.date <= endDate);
    }

    async getExpensesForYear(year) {
        const expenses = await this.getAllExpenses();
        return expenses.filter(exp => exp.date.startsWith(String(year)));
    }

    // CATEGORIES OPERATIONS
    async addCategory(category) {
        const transaction = this.db.transaction(['categories'], 'readwrite');
        const store = transaction.objectStore('categories');
        
        return new Promise((resolve, reject) => {
            const request = store.add(category);
            request.onsuccess = () => resolve(category.name);
            request.onerror = () => reject(request.error);
        });
    }

    async updateCategory(name, category) {
        const transaction = this.db.transaction(['categories'], 'readwrite');
        const store = transaction.objectStore('categories');
        
        category.name = name;
        
        return new Promise((resolve, reject) => {
            const request = store.put(category);
            request.onsuccess = () => resolve(name);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteCategory(name) {
        const transaction = this.db.transaction(['categories'], 'readwrite');
        const store = transaction.objectStore('categories');
        
        return new Promise((resolve, reject) => {
            const request = store.delete(name);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getCategory(name) {
        const transaction = this.db.transaction(['categories'], 'readonly');
        const store = transaction.objectStore('categories');
        
        return new Promise((resolve, reject) => {
            const request = store.get(name);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllCategories() {
        const transaction = this.db.transaction(['categories'], 'readonly');
        const store = transaction.objectStore('categories');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // BUDGETS OPERATIONS
    async setBudget(category, amount) {
        const transaction = this.db.transaction(['budgets'], 'readwrite');
        const store = transaction.objectStore('budgets');
        
        const budget = { category, amount, setDate: Date.now() };
        
        return new Promise((resolve, reject) => {
            const request = store.put(budget);
            request.onsuccess = () => resolve(category);
            request.onerror = () => reject(request.error);
        });
    }

    async getBudget(category) {
        const transaction = this.db.transaction(['budgets'], 'readonly');
        const store = transaction.objectStore('budgets');
        
        return new Promise((resolve, reject) => {
            const request = store.get(category);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllBudgets() {
        const transaction = this.db.transaction(['budgets'], 'readonly');
        const store = transaction.objectStore('budgets');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteBudget(category) {
        const transaction = this.db.transaction(['budgets'], 'readwrite');
        const store = transaction.objectStore('budgets');
        
        return new Promise((resolve, reject) => {
            const request = store.delete(category);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // SETTINGS OPERATIONS
    async setSetting(key, value) {
        const transaction = this.db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        
        return new Promise((resolve, reject) => {
            const request = store.put({ key, value });
            request.onsuccess = () => resolve(value);
            request.onerror = () => reject(request.error);
        });
    }

    async getSetting(key, defaultValue = null) {
        const transaction = this.db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result?.value ?? defaultValue);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllSettings() {
        const transaction = this.db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const settings = {};
                request.result.forEach(item => {
                    settings[item.key] = item.value;
                });
                resolve(settings);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // RECURRING EXPENSES OPERATIONS
    async addRecurringExpense(recurring) {
        const transaction = this.db.transaction(['recurringExpenses'], 'readwrite');
        const store = transaction.objectStore('recurringExpenses');
        
        recurring.id = 'rec_' + Date.now() + Math.random().toString(36).substr(2, 9);
        recurring.createdAt = Date.now();
        
        return new Promise((resolve, reject) => {
            const request = store.add(recurring);
            request.onsuccess = () => resolve(recurring.id);
            request.onerror = () => reject(request.error);
        });
    }

    async getRecurringExpenses() {
        const transaction = this.db.transaction(['recurringExpenses'], 'readonly');
        const store = transaction.objectStore('recurringExpenses');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteRecurringExpense(id) {
        const transaction = this.db.transaction(['recurringExpenses'], 'readwrite');
        const store = transaction.objectStore('recurringExpenses');
        
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // DATA EXPORT/IMPORT
    async exportData() {
        const data = {
            expenses: await this.getAllExpenses(),
            categories: await this.getAllCategories(),
            budgets: await this.getAllBudgets(),
            settings: await this.getAllSettings(),
            recurringExpenses: await this.getRecurringExpenses(),
            exportDate: new Date().toISOString()
        };
        return data;
    }

    async importData(data, merge = false) {
        if (!merge) {
            await this.clearAllData();
        }

        // Import categories
        if (data.categories && Array.isArray(data.categories)) {
            for (const category of data.categories) {
                try {
                    await this.addCategory(category);
                } catch (e) {
                    console.warn('Category already exists:', category.name);
                }
            }
        }

        // Import expenses
        if (data.expenses && Array.isArray(data.expenses)) {
            for (const expense of data.expenses) {
                delete expense.id;
                await this.addExpense(expense);
            }
        }

        // Import budgets
        if (data.budgets && Array.isArray(data.budgets)) {
            for (const budget of data.budgets) {
                await this.setBudget(budget.category, budget.amount);
            }
        }

        // Import settings
        if (data.settings && typeof data.settings === 'object') {
            for (const [key, value] of Object.entries(data.settings)) {
                await this.setSetting(key, value);
            }
        }

        // Import recurring expenses
        if (data.recurringExpenses && Array.isArray(data.recurringExpenses)) {
            for (const recurring of data.recurringExpenses) {
                delete recurring.id;
                await this.addRecurringExpense(recurring);
            }
        }
    }

    // CLEAR DATA
    async clearAllData() {
        const stores = ['expenses', 'categories', 'budgets', 'settings', 'recurringExpenses'];
        
        for (const storeName of stores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }

    // STATISTICS
    async getTotalSpent(year, month) {
        const expenses = await this.getExpensesByMonth(year, month);
        return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    }

    async getCategoryTotals(year, month) {
        const expenses = await this.getExpensesByMonth(year, month);
        const totals = {};
        
        expenses.forEach(exp => {
            totals[exp.category] = (totals[exp.category] || 0) + parseFloat(exp.amount || 0);
        });
        
        return totals;
    }

    async getMonthlyTotals(year) {
        const expenses = await this.getExpensesForYear(year);
        const totals = {};
        
        for (let month = 1; month <= 12; month++) {
            const monthStr = `${year}-${String(month).padStart(2, '0')}`;
            const monthExpenses = expenses.filter(exp => exp.date.startsWith(monthStr));
            totals[month] = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
        }
        
        return totals;
    }

    async getWeeklyTotals(year, month) {
        const expenses = await this.getExpensesByMonth(year, month);
        const weeks = [0, 0, 0, 0, 0, 0];
        
        expenses.forEach(exp => {
            const day = parseInt(exp.date.split('-')[2]);
            const week = Math.floor((day - 1) / 7);
            weeks[week] = (weeks[week] || 0) + parseFloat(exp.amount || 0);
        });
        
        return weeks;
    }
}

// Create global database instance
const db = new ExpenseDB();
