// Utility Functions
class Utils {
    static currencies = {
        'USD': { symbol: '$', name: 'US Dollar' },
        'EUR': { symbol: '€', name: 'Euro' },
        'GBP': { symbol: '£', name: 'British Pound' },
        'JPY': { symbol: '¥', name: 'Japanese Yen' },
        'INR': { symbol: '₹', name: 'Indian Rupee' },
        'AUD': { symbol: 'A$', name: 'Australian Dollar' },
        'CAD': { symbol: 'C$', name: 'Canadian Dollar' },
        'CHF': { symbol: 'Fr', name: 'Swiss Franc' },
        'CNY': { symbol: '¥', name: 'Chinese Yuan' },
        'MXN': { symbol: 'Mex$', name: 'Mexican Peso' }
    };

    static defaultCategories = [
        { name: 'Food', emoji: '🍔', color: '#FF6B6B' },
        { name: 'Transport', emoji: '🚗', color: '#4ECDC4' },
        { name: 'Utilities', emoji: '💡', color: '#FFE66D' },
        { name: 'Entertainment', emoji: '🎬', color: '#95E1D3' },
        { name: 'Health', emoji: '⚕️', color: '#F38181' },
        { name: 'Shopping', emoji: '🛍️', color: '#AA96DA' },
        { name: 'Work', emoji: '💼', color: '#FCBAD3' },
        { name: 'Education', emoji: '📚', color: '#A8D8EA' },
        { name: 'Travel', emoji: '✈️', color: '#AA96DA' },
        { name: 'Other', emoji: '📌', color: '#667EEA' }
    ];

    // Format currency
    static formatCurrency(amount, currency = 'USD') {
        const symbol = this.currencies[currency]?.symbol || '$';
        const value = parseFloat(amount || 0).toFixed(2);
        return `${symbol}${value}`;
    }

    // Format date
    static formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Format date for input
    static formatDateForInput(dateString) {
        return dateString; // YYYY-MM-DD format
    }

    // Get today's date in YYYY-MM-DD format
    static getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Get month name
    static getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1];
    }

    // Get current month and year
    static getCurrentMonthYear() {
        const today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth() + 1
        };
    }

    // Parse month from input value
    static parseMonth(monthValue) {
        if (!monthValue) return this.getCurrentMonthYear();
        const [year, month] = monthValue.split('-');
        return { year: parseInt(year), month: parseInt(month) };
    }

    // Get month value for input
    static getMonthValue(year, month) {
        return `${year}-${String(month).padStart(2, '0')}`;
    }

    // Clone object
    static cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Download file
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Generate CSV from data
    static generateCSV(expenses, currency) {
        let csv = 'Date,Category,Description,Amount,Notes,Tags\n';
        
        expenses.forEach(exp => {
            const tags = (exp.tags || []).join(';');
            const notes = (exp.notes || '').replace(/"/g, '""');
            csv += `${exp.date},${exp.category},"${exp.description}",${exp.amount},"${notes}","${tags}"\n`;
        });
        
        return csv;
    }

    // Parse CSV data
    static parseCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const expenses = [];
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 4) {
                expenses.push({
                    date: values[0],
                    category: values[1],
                    description: values[2],
                    amount: parseFloat(values[3]),
                    notes: values[4] || '',
                    tags: (values[5] || '').split(';').filter(t => t.trim())
                });
            }
        }
        
        return expenses;
    }

    // Parse CSV line handling quotes
    static parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Read file as text
    static readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Show notification
    static showNotification(message, type = 'info', duration = 3000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('main');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            if (duration > 0) {
                setTimeout(() => {
                    alertDiv.remove();
                }, duration);
            }
        }
    }

    // Get day of week
    static getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date + 'T00:00:00').getDay()];
    }

    // Get week number
    static getWeekNumber(date) {
        const d = new Date(date + 'T00:00:00');
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const firstDay = new Date(d.setDate(diff));
        const weeks = Math.floor((d - firstDay) / (7 * 24 * 60 * 60 * 1000));
        return weeks + 1;
    }

    // Generate chart colors
    static generateColors(count) {
        const colors = [
            '#667EEA', '#764BA2', '#F093FB', '#4FACFE', '#00F2FE',
            '#43E97B', '#38F9D7', '#FA709A', '#FEE140', '#30B0FE'
        ];
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }

    // Validate date
    static isValidDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date instanceof Date && !isNaN(date);
    }

    // Calculate age
    static daysSinceDate(dateString) {
        const today = new Date();
        const date = new Date(dateString + 'T00:00:00');
        const diff = today - date;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    // Debounce function
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Local storage with expiry
    static setWithExpiry(key, value, expiryMs) {
        const item = {
            value: value,
            expiry: Date.now() + expiryMs
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static getWithExpiry(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const data = JSON.parse(item);
        if (Date.now() > data.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data.value;
    }

    // Get spending trend (percentage change)
    static getSpendingTrend(currentMonth, previousMonth) {
        if (previousMonth === 0) return 0;
        return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    }

    // Check if budget exceeded
    static isBudgetExceeded(spent, budget) {
        return spent > budget;
    }

    // Get budget status
    static getBudgetStatus(spent, budget) {
        if (spent === 0) return 'none';
        const percentage = (spent / budget) * 100;
        if (percentage < 50) return 'good';
        if (percentage < 80) return 'warning';
        return 'danger';
    }

    // Calculate percentage
    static calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }

    // Truncate string
    static truncate(str, length = 50) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    // Generate unique ID
    static generateId(prefix = '') {
        return prefix + '_' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Sort expenses
    static sortExpenses(expenses, sortBy = 'date', order = 'desc') {
        const sorted = [...expenses];
        
        sorted.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'date' || sortBy === 'amount') {
                aVal = new Date(aVal) || parseFloat(aVal);
                bVal = new Date(bVal) || parseFloat(bVal);
            }
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        return sorted;
    }

    // Filter expenses
    static filterExpenses(expenses, filters) {
        return expenses.filter(exp => {
            if (filters.category && exp.category !== filters.category) return false;
            if (filters.search && !exp.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.startDate && exp.date < filters.startDate) return false;
            if (filters.endDate && exp.date > filters.endDate) return false;
            if (filters.minAmount && parseFloat(exp.amount) < parseFloat(filters.minAmount)) return false;
            if (filters.maxAmount && parseFloat(exp.amount) > parseFloat(filters.maxAmount)) return false;
            return true;
        });
    }
}
