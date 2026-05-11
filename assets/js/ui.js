// UI Management
class UIManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.modals = {};
        this.currency = 'USD';
    }

    // Initialize UI
    async init() {
        this.setupEventListeners();
        this.setupModals();
        this.loadTheme();
        this.loadCurrency();
        await this.initializeDefaults();
        await this.renderDashboard();
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.closest('button').dataset.section));
        });

        // Forms
        document.getElementById('expenseForm').addEventListener('submit', (e) => e.preventDefault());
        document.getElementById('categoryForm').addEventListener('submit', (e) => e.preventDefault());
        document.getElementById('budgetForm').addEventListener('submit', (e) => e.preventDefault());
        document.getElementById('settingsForm').addEventListener('submit', (e) => e.preventDefault());

        // Buttons
        document.getElementById('saveExpenseBtn').addEventListener('click', () => this.saveExpense());
        document.getElementById('deleteExpenseBtn').addEventListener('click', () => this.deleteExpense());
        document.getElementById('saveCategoryBtn').addEventListener('click', () => this.saveCategory());
        document.getElementById('deleteCategoryBtn').addEventListener('click', () => this.deleteCategory());
        document.getElementById('saveBudgetBtn').addEventListener('click', () => this.saveBudget());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());

        // Export/Import
        document.getElementById('exportJSON').addEventListener('click', () => this.exportJSON());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportCSV());
        document.getElementById('exportPDF').addEventListener('click', () => this.exportPDF());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('backupBtn').addEventListener('click', () => this.backupData());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearData());

        // Recurring checkbox
        document.getElementById('expenseRecurring').addEventListener('change', (e) => {
            document.getElementById('recurringOptions').style.display = e.target.checked ? 'block' : 'none';
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('monthFilter').addEventListener('change', () => this.applyFilters());

        // Expense modal
        document.getElementById('expenseModal').addEventListener('show.bs.modal', () => this.prepareExpenseForm());

        // Offline detector
        window.addEventListener('online', () => this.showOfflineIndicator(false));
        window.addEventListener('offline', () => this.showOfflineIndicator(true));

        // Prevent form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') e.preventDefault();
            });
        });
    }

    // Setup Bootstrap modals
    setupModals() {
        this.modals.expense = new bootstrap.Modal(document.getElementById('expenseModal'));
        this.modals.category = new bootstrap.Modal(document.getElementById('categoryModal'));
        this.modals.budget = new bootstrap.Modal(document.getElementById('budgetModal'));
        this.modals.settings = new bootstrap.Modal(document.getElementById('settingsModal'));
        this.modals.importExport = new bootstrap.Modal(document.getElementById('importExportModal'));
    }

    // Switch section
    switchSection(sectionId) {
        // Hide current section
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.querySelectorAll('.nav-section-btn').forEach(btn => btn.classList.remove('active'));

        // Show new section
        document.getElementById(sectionId).classList.add('active');
        event.target.classList.add('active');

        // Close offcanvas
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMenu'));
        if (offcanvas) offcanvas.hide();

        this.currentSection = sectionId;

        // Load section content
        if (sectionId === 'dashboard') {
            this.renderDashboard();
        } else if (sectionId === 'expensesSection') {
            this.renderExpenses();
        } else if (sectionId === 'categoriesSection') {
            this.renderCategories();
        } else if (sectionId === 'statisticsSection') {
            this.renderStatistics();
        }
    }

    // Initialize defaults
    async initializeDefaults() {
        const categories = await db.getAllCategories();
        
        if (categories.length === 0) {
            for (const cat of Utils.defaultCategories) {
                await db.addCategory(cat);
            }
        }

        // Set default settings
        if (!await db.getSetting('currency')) {
            await db.setSetting('currency', 'USD');
        }
        if (!await db.getSetting('theme')) {
            await db.setSetting('theme', 'light');
        }
    }

    // Prepare expense form
    async prepareExpenseForm() {
        const categories = await db.getAllCategories();
        const categorySelect = document.getElementById('expenseCategory');
        const categoryFilter = document.getElementById('categoryFilter');
        
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = `${cat.emoji} ${cat.name}`;
            categorySelect.appendChild(option);
            
            const filterOption = option.cloneNode(true);
            categoryFilter.appendChild(filterOption);
        });

        // Set today's date
        document.getElementById('expenseDate').valueAsDate = new Date();
        document.getElementById('expenseId').value = '';
        document.getElementById('deleteExpenseBtn').style.display = 'none';
        document.getElementById('expenseForm').reset();
    }

    // Save expense
    async saveExpense() {
        const id = document.getElementById('expenseId').value;
        const expense = {
            date: document.getElementById('expenseDate').value,
            amount: document.getElementById('expenseAmount').value,
            category: document.getElementById('expenseCategory').value,
            description: document.getElementById('expenseDescription').value,
            notes: document.getElementById('expenseNotes').value,
            tags: document.getElementById('expenseTags').value.split(',').map(t => t.trim()).filter(t => t),
            recurring: document.getElementById('expenseRecurring').checked,
            recurringType: document.getElementById('recurringType').value || 'monthly'
        };

        try {
            if (id) {
                await db.updateExpense(id, expense);
            } else {
                await db.addExpense(expense);
            }
            
            Utils.showNotification('Expense saved successfully!', 'success');
            this.modals.expense.hide();
            await this.renderExpenses();
            await this.renderDashboard();
        } catch (error) {
            Utils.showNotification('Error saving expense: ' + error.message, 'danger');
        }
    }

    // Edit expense
    async editExpense(id) {
        try {
            const expense = await db.getExpense(id);
            if (expense) {
                document.getElementById('expenseId').value = id;
                document.getElementById('expenseDate').value = expense.date;
                document.getElementById('expenseAmount').value = expense.amount;
                document.getElementById('expenseCategory').value = expense.category;
                document.getElementById('expenseDescription').value = expense.description || '';
                document.getElementById('expenseNotes').value = expense.notes || '';
                document.getElementById('expenseRecurring').checked = expense.recurring || false;
                document.getElementById('recurringType').value = expense.recurringType || 'monthly';
                document.getElementById('expenseTags').value = (expense.tags || []).join(', ');
                document.getElementById('expenseModalTitle').textContent = 'Edit Expense';
                document.getElementById('deleteExpenseBtn').style.display = 'block';
                
                this.modals.expense.show();
            }
        } catch (error) {
            Utils.showNotification('Error loading expense: ' + error.message, 'danger');
        }
    }

    // Delete expense
    async deleteExpense() {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                const id = document.getElementById('expenseId').value;
                await db.deleteExpense(id);
                Utils.showNotification('Expense deleted successfully!', 'success');
                this.modals.expense.hide();
                await this.renderExpenses();
                await this.renderDashboard();
            } catch (error) {
                Utils.showNotification('Error deleting expense: ' + error.message, 'danger');
            }
        }
    }

    // Save category
    async saveCategory() {
        const id = document.getElementById('categoryId').value;
        const category = {
            name: document.getElementById('categoryName').value,
            emoji: document.getElementById('categoryEmoji').value,
            color: document.getElementById('categoryColor').value
        };

        try {
            if (id) {
                await db.updateCategory(id, category);
            } else {
                await db.addCategory(category);
            }
            
            Utils.showNotification('Category saved successfully!', 'success');
            this.modals.category.hide();
            await this.renderCategories();
            await this.prepareExpenseForm();
        } catch (error) {
            Utils.showNotification('Error saving category: ' + error.message, 'danger');
        }
    }

    // Delete category
    async deleteCategory() {
        if (confirm('Are you sure? Expenses in this category will not be deleted.')) {
            try {
                const name = document.getElementById('categoryId').value;
                await db.deleteCategory(name);
                Utils.showNotification('Category deleted!', 'success');
                this.modals.category.hide();
                await this.renderCategories();
            } catch (error) {
                Utils.showNotification('Error deleting category: ' + error.message, 'danger');
            }
        }
    }

    // Edit category
    async editCategory(name) {
        try {
            const category = await db.getCategory(name);
            if (category) {
                document.getElementById('categoryId').value = name;
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryEmoji').value = category.emoji;
                document.getElementById('categoryColor').value = category.color;
                document.getElementById('deleteCategoryBtn').style.display = 'block';
                this.modals.category.show();
            }
        } catch (error) {
            Utils.showNotification('Error loading category: ' + error.message, 'danger');
        }
    }

    // Add new category (modal)
    showAddCategoryModal() {
        document.getElementById('categoryId').value = '';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryColor').value = '#667EEA';
        document.getElementById('categoryEmoji').value = '📌';
        document.getElementById('deleteCategoryBtn').style.display = 'none';
        this.modals.category.show();
    }

    // Save budget
    async saveBudget() {
        const category = document.getElementById('budgetCategory').value;
        const amount = document.getElementById('budgetAmount').value;

        try {
            await db.setBudget(category, parseFloat(amount));
            Utils.showNotification('Budget saved!', 'success');
            this.modals.budget.hide();
            await this.renderDashboard();
        } catch (error) {
            Utils.showNotification('Error saving budget: ' + error.message, 'danger');
        }
    }

    // Save settings
    async saveSettings() {
        try {
            const currency = document.getElementById('settingsCurrency').value;
            const theme = document.getElementById('settingsTheme').value;
            const notifications = document.getElementById('settingsNotifications').checked;
            const yearStart = document.getElementById('settingsYearStart').value;

            await db.setSetting('currency', currency);
            await db.setSetting('theme', theme);
            await db.setSetting('notifications', notifications);
            await db.setSetting('yearStart', yearStart);

            this.currency = currency;
            this.applyTheme(theme);

            Utils.showNotification('Settings saved!', 'success');
            this.modals.settings.hide();
            location.reload(); // Refresh to apply all changes
        } catch (error) {
            Utils.showNotification('Error saving settings: ' + error.message, 'danger');
        }
    }

    // Load theme
    async loadTheme() {
        const theme = await db.getSetting('theme', 'light');
        this.applyTheme(theme);
        document.getElementById('settingsTheme').value = theme;
    }

    // Load currency
    async loadCurrency() {
        this.currency = await db.getSetting('currency', 'USD');
        document.getElementById('settingsCurrency').value = this.currency;
        
        const symbol = Utils.currencies[this.currency].symbol;
        document.getElementById('currencySymbol').textContent = symbol;
        document.getElementById('budgetCurrencySymbol').textContent = symbol;
    }

    // Apply theme
    applyTheme(theme) {
        document.body.classList.remove('dark-mode');
        
        if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
        }
    }

    // Render dashboard
    async renderDashboard() {
        const { year, month } = Utils.getCurrentMonthYear();
        
        try {
            const totalSpent = await db.getTotalSpent(year, month);
            const categoryTotals = await db.getCategoryTotals(year, month);
            const allExpenses = await db.getExpensesByMonth(year, month);
            const allBudgets = await db.getAllBudgets();

            // Update dashboard cards
            document.getElementById('totalSpent').textContent = Utils.formatCurrency(totalSpent, this.currency);
            document.getElementById('transactionCount').textContent = allExpenses.length;

            const daysInMonth = new Date(year, month, 0).getDate();
            const avgDaily = daysInMonth > 0 ? totalSpent / daysInMonth : 0;
            document.getElementById('avgDaily').textContent = Utils.formatCurrency(avgDaily, this.currency);

            // Budget status
            let totalBudget = 0;
            let totalSpentAgainstBudget = 0;
            
            allBudgets.forEach(budget => {
                totalBudget += parseFloat(budget.amount);
                totalSpentAgainstBudget += categoryTotals[budget.category] || 0;
            });

            const budgetRemaining = Math.max(0, totalBudget - totalSpentAgainstBudget);
            document.getElementById('budgetRemaining').textContent = Utils.formatCurrency(budgetRemaining, this.currency);
            document.getElementById('budgetStatus').textContent = `of ${Utils.formatCurrency(totalBudget, this.currency)}`;

            // Render budget items
            this.renderBudgetStatus(allBudgets, categoryTotals);

            // Render charts
            await this.renderCharts(categoryTotals, year, month);
        } catch (error) {
            console.error('Error rendering dashboard:', error);
        }
    }

    // Render budget status
    renderBudgetStatus(budgets, categoryTotals) {
        const container = document.querySelector('[id="budgetStatus"]');
        
        if (budgets.length === 0) {
            container.innerHTML = '<p class="text-muted">No budgets set. <a href="#" data-bs-toggle="modal" data-bs-target="#budgetModal">Add one</a></p>';
            return;
        }

        let html = '';
        budgets.forEach(budget => {
            const spent = categoryTotals[budget.category] || 0;
            const percentage = Math.min(100, (spent / budget.amount) * 100);
            const status = Utils.getBudgetStatus(spent, budget.amount);

            html += `
                <div class="budget-item">
                    <div class="budget-header">
                        <span class="budget-category">${budget.category}</span>
                        <span class="budget-amount">${Utils.formatCurrency(spent, this.currency)} / ${Utils.formatCurrency(budget.amount, this.currency)}</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar progress-bar-${status}" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Render expenses
    async renderExpenses() {
        try {
            const expenses = await db.getAllExpenses();
            const filtered = this.applyFilters(expenses);

            const container = document.getElementById('expensesList');
            
            if (filtered.length === 0) {
                container.innerHTML = '<div class="no-data"><i class="bi bi-inbox"></i><p>No expenses found</p></div>';
                return;
            }

            let html = '<table class="table table-hover">';
            html += '<thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Actions</th></tr></thead>';
            html += '<tbody>';

            filtered.forEach(expense => {
                html += `
                    <tr>
                        <td>${Utils.formatDate(expense.date)}</td>
                        <td>${expense.description || '—'}</td>
                        <td><span class="badge bg-primary">${expense.category}</span></td>
                        <td><strong>${Utils.formatCurrency(expense.amount, this.currency)}</strong></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="ui.editExpense('${expense.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;
        } catch (error) {
            console.error('Error rendering expenses:', error);
        }
    }

    // Render categories
    async renderCategories() {
        try {
            const categories = await db.getAllCategories();
            const expenses = await db.getAllExpenses();
            const container = document.getElementById('categoriesList');

            let html = '';

            categories.forEach(cat => {
                const spent = expenses
                    .filter(e => e.category === cat.name)
                    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

                html += `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="category-card" style="border-left: 4px solid ${cat.color}">
                            <div class="category-icon">${cat.emoji}</div>
                            <div class="category-name">${cat.name}</div>
                            <div class="category-spent">${Utils.formatCurrency(spent, this.currency)}</div>
                            <button class="btn btn-sm btn-outline-primary mt-2" onclick="ui.editCategory('${cat.name}')">
                                Edit
                            </button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        } catch (error) {
            console.error('Error rendering categories:', error);
        }
    }

    // Render statistics
    async renderStatistics() {
        const { year } = Utils.getCurrentMonthYear();
        
        try {
            const monthlyTotals = await db.getMonthlyTotals(year);
            
            // Render weekly, comparison, and category stats
            this.renderWeeklyChart(year);
            this.renderComparisonChart(monthlyTotals);
            this.renderCategoryStats();
        } catch (error) {
            console.error('Error rendering statistics:', error);
        }
    }

    // Apply filters
    applyFilters(expenses = null) {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const monthValue = document.getElementById('monthFilter').value;

        let filtered = expenses || [];

        // Search filter
        if (search) {
            filtered = filtered.filter(e => 
                (e.description || '').toLowerCase().includes(search) ||
                (e.notes || '').toLowerCase().includes(search)
            );
        }

        // Category filter
        if (category) {
            filtered = filtered.filter(e => e.category === category);
        }

        // Month filter
        if (monthValue) {
            const { year, month } = Utils.parseMonth(monthValue);
            const monthStr = `${year}-${String(month).padStart(2, '0')}`;
            filtered = filtered.filter(e => e.date.startsWith(monthStr));
        }

        return filtered;
    }

    // Show offline indicator
    showOfflineIndicator(offline) {
        const indicator = document.getElementById('offlineIndicator');
        if (offline) {
            indicator.style.display = 'block';
            indicator.classList.add('show');
        } else {
            indicator.classList.remove('show');
            setTimeout(() => indicator.style.display = 'none', 300);
        }
    }

    // Export functions
    async exportJSON() {
        try {
            const data = await db.exportData();
            const json = JSON.stringify(data, null, 2);
            const filename = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            Utils.downloadFile(json, filename, 'application/json');
            Utils.showNotification('Data exported as JSON!', 'success');
        } catch (error) {
            Utils.showNotification('Error exporting data: ' + error.message, 'danger');
        }
    }

    async exportCSV() {
        try {
            const expenses = await db.getAllExpenses();
            const csv = Utils.generateCSV(expenses, this.currency);
            const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
            Utils.downloadFile(csv, filename, 'text/csv');
            Utils.showNotification('Data exported as CSV!', 'success');
        } catch (error) {
            Utils.showNotification('Error exporting data: ' + error.message, 'danger');
        }
    }

    async exportPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            const expenses = await db.getAllExpenses();
            const data = expenses.map(e => [
                Utils.formatDate(e.date),
                e.category,
                e.description || '—',
                Utils.formatCurrency(e.amount, this.currency)
            ]);

            pdf.autoTable({
                head: [['Date', 'Category', 'Description', 'Amount']],
                body: data,
                startY: 10
            });

            pdf.save(`expenses-${new Date().toISOString().split('T')[0]}.pdf`);
            Utils.showNotification('PDF exported!', 'success');
        } catch (error) {
            Utils.showNotification('Error exporting PDF: ' + error.message, 'danger');
        }
    }

    async importData() {
        const file = document.getElementById('importFile').files[0];
        if (!file) {
            Utils.showNotification('Please select a file', 'warning');
            return;
        }

        try {
            const content = await Utils.readFileAsText(file);
            
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(content);
                await db.importData(data, true);
            } else if (file.name.endsWith('.csv')) {
                const expenses = Utils.parseCSV(content);
                for (const expense of expenses) {
                    await db.addExpense(expense);
                }
            }

            Utils.showNotification('Data imported successfully!', 'success');
            this.modals.importExport.hide();
            location.reload();
        } catch (error) {
            Utils.showNotification('Error importing data: ' + error.message, 'danger');
        }
    }

    async backupData() {
        try {
            const data = await db.exportData();
            const json = JSON.stringify(data, null, 2);
            const filename = `expense-tracker-full-backup-${new Date().toISOString()}.json`;
            Utils.downloadFile(json, filename, 'application/json');
            Utils.showNotification('Backup created!', 'success');
        } catch (error) {
            Utils.showNotification('Error creating backup: ' + error.message, 'danger');
        }
    }

    async clearData() {
        if (confirm('⚠️ This will delete ALL your data. This cannot be undone. Are you sure?')) {
            if (confirm('Really? Type "YES" in the next prompt to confirm.')) {
                try {
                    await db.clearAllData();
                    await this.initializeDefaults();
                    Utils.showNotification('All data cleared!', 'success');
                    location.reload();
                } catch (error) {
                    Utils.showNotification('Error clearing data: ' + error.message, 'danger');
                }
            }
        }
    }

    // Placeholder for chart rendering (will be in charts.js)
    async renderCharts(categoryTotals, year, month) {
        // Charts will be rendered by ChartManager
    }

    async renderWeeklyChart(year) {
        // Will be implemented in charts.js
    }

    async renderComparisonChart(monthlyTotals) {
        // Will be implemented in charts.js
    }

    async renderCategoryStats() {
        // Will be implemented in charts.js
    }
}

// Create global UI instance
const ui = new UIManager();
