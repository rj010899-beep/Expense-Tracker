// Main Application
class ExpenseTrackerApp {
    constructor() {
        this.initialized = false;
        this.deferredPrompt = null;
    }

    async init() {
        try {
            // Initialize database
            await db.init();
            console.log('✓ Database initialized');

            // Initialize UI Manager
            await ui.init();
            console.log('✓ UI initialized');

            // Register service worker
            this.registerServiceWorker();

            // Handle PWA install prompt
            this.handlePWAInstallPrompt();

            // Set up recurring expenses
            this.processRecurringExpenses();

            // Handle online/offline
            this.handleConnectionStatus();

            this.initialized = true;
            console.log('✓ Application initialized');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    // Register Service Worker
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('✓ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        }
    }

    // Handle PWA install prompt
    handlePWAInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            // Show install button or prompt
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('✓ PWA installed');
            this.deferredPrompt = null;
            Utils.showNotification('App installed! You can use it offline.', 'success');
        });
    }

    // Show install prompt
    showInstallPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
            <h6 class="mb-2">📱 Install App</h6>
            <p class="small">Add Expense Tracker to your home screen for offline access</p>
            <div class="d-grid gap-2">
                <button class="btn btn-primary btn-sm" id="installBtn">Install</button>
                <button class="btn btn-outline-secondary btn-sm" id="dismissBtn">Dismiss</button>
            </div>
        `;

        document.body.appendChild(prompt);

        document.getElementById('installBtn').addEventListener('click', () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then(choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    this.deferredPrompt = null;
                    prompt.remove();
                });
            }
        });

        document.getElementById('dismissBtn').addEventListener('click', () => {
            prompt.remove();
        });
    }

    // Process recurring expenses
    async processRecurringExpenses() {
        try {
            const recurring = await db.getRecurringExpenses();
            const today = Utils.getTodayDate();

            for (const rec of recurring) {
                const lastCreated = rec.lastCreated || rec.createdAt;
                
                if (this.shouldCreateRecurring(lastCreated, rec.recurringType, today)) {
                    // Create new expense
                    const newExpense = {
                        date: today,
                        amount: rec.amount,
                        category: rec.category,
                        description: rec.description,
                        notes: `Auto-created: ${rec.description}`,
                        recurring: true,
                        recurringType: rec.recurringType
                    };

                    await db.addExpense(newExpense);
                    
                    // Update last created date
                    rec.lastCreated = today;
                    await db.addRecurringExpense(rec);
                }
            }
        } catch (error) {
            console.warn('Error processing recurring expenses:', error);
        }
    }

    // Check if recurring expense should be created
    shouldCreateRecurring(lastCreated, type, today) {
        const lastDate = new Date(lastCreated + 'T00:00:00');
        const todayDate = new Date(today + 'T00:00:00');
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        switch (type) {
            case 'daily':
                return diffDays >= 1;
            case 'weekly':
                return diffDays >= 7;
            case 'monthly':
                return diffDays >= 30;
            case 'yearly':
                return diffDays >= 365;
            default:
                return false;
        }
    }

    // Handle connection status
    handleConnectionStatus() {
        const updateStatus = () => {
            if (navigator.onLine) {
                ui.showOfflineIndicator(false);
            } else {
                ui.showOfflineIndicator(true);
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    // Check for updates
    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update();
            });
        }
    }

    // Sync data with backend (future feature)
    async syncData() {
        try {
            const data = await db.exportData();
            // Send to backend API
            console.log('Syncing data:', data);
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    // Get app statistics
    async getAppStats() {
        try {
            const { year, month } = Utils.getCurrentMonthYear();
            const expenses = await db.getAllExpenses();
            const categories = await db.getAllCategories();
            const budgets = await db.getAllBudgets();

            return {
                totalExpenses: expenses.length,
                totalCategories: categories.length,
                totalBudgets: budgets.length,
                thisMonth: await db.getTotalSpent(year, month),
                thisYear: (await db.getExpensesForYear(year)).length
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return null;
        }
    }

    // Clean old data (optional: older than 2 years)
    async cleanOldData(yearsToKeep = 2) {
        try {
            const expenses = await db.getAllExpenses();
            const cutoffDate = new Date();
            cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsToKeep);
            const cutoffString = cutoffDate.toISOString().split('T')[0];

            let deleted = 0;
            for (const expense of expenses) {
                if (expense.date < cutoffString) {
                    await db.deleteExpense(expense.id);
                    deleted++;
                }
            }

            if (deleted > 0) {
                console.log(`Cleaned ${deleted} old expenses`);
            }
        } catch (error) {
            console.error('Error cleaning old data:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new ExpenseTrackerApp();
    await app.init();

    // Make app globally available
    window.expenseTrackerApp = app;
});

// Prevent accidental page navigation with unsaved data
window.addEventListener('beforeunload', (e) => {
    // Only warn if there are pending changes (optional)
    // e.preventDefault();
    // e.returnValue = '';
});

// Handle visibility change (pause/resume operations)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('App is visible');
        // Resume any paused operations
    } else {
        console.log('App is hidden');
        // Pause any ongoing operations
    }
});

// Log performance metrics
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('✓ App loaded in ' + loadTime + 'ms');
    }
});

// Check for service worker updates periodically
setInterval(() => {
    if (window.expenseTrackerApp) {
        window.expenseTrackerApp.checkForUpdates();
    }
}, 60000); // Check every minute

// Log navigation times
console.log('📱 Expense Tracker PWA Loaded');
console.log('🌐 Online:', navigator.onLine);
console.log('💾 Storage:', navigator.storage ? 'Available' : 'Limited');
console.log('🔔 Notifications:', 'Notification' in window ? 'Available' : 'Not available');
