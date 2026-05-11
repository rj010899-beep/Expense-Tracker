// Chart Management
class ChartManager {
    constructor() {
        this.charts = {};
        Chart.defaults.color = '#718096';
        Chart.defaults.borderColor = '#e2e8f0';
    }

    // Destroy all charts
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    // Create category pie chart
    async createCategoryChart(categoryTotals, currency) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.charts.category) this.charts.category.destroy();

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const colors = Utils.generateColors(labels.length);

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: document.body.classList.contains('dark-mode') ? '#2d3748' : 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Utils.formatCurrency(context.parsed, currency);
                            }
                        }
                    }
                }
            }
        });
    }

    // Create monthly trend line chart
    async createTrendChart(monthlyTotals, year, currency) {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        if (this.charts.trend) this.charts.trend.destroy();

        const months = [];
        const data = [];

        for (let month = 1; month <= 12; month++) {
            months.push(Utils.getMonthName(month).substring(0, 3));
            data.push(monthlyTotals[month] || 0);
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Spending',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Spent: ' + Utils.formatCurrency(context.parsed.y, currency);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, currency);
                            }
                        }
                    }
                }
            }
        });
    }

    // Create weekly bar chart
    async createWeeklyChart(weeklyTotals, year, month, currency) {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        if (this.charts.weekly) this.charts.weekly.destroy();

        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
        const data = weeklyTotals.slice(0, 5);

        this.charts.weekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeks,
                datasets: [{
                    label: 'Weekly Spending',
                    data: data,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#4facfe',
                        '#00f2fe'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Utils.formatCurrency(context.parsed.y, currency);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, currency);
                            }
                        }
                    }
                }
            }
        });
    }

    // Create comparison chart (last 3 months)
    async createComparisonChart(monthlyTotals, currency) {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        if (this.charts.comparison) this.charts.comparison.destroy();

        const now = new Date();
        const months = [];
        const data = [];

        for (let i = 2; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = d.getMonth() + 1;
            months.push(Utils.getMonthName(month).substring(0, 3));
            data.push(monthlyTotals[month] || 0);
        }

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Spending',
                    data: data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.6)',
                        'rgba(118, 75, 162, 0.6)',
                        'rgba(240, 147, 251, 0.6)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Utils.formatCurrency(context.parsed.y, currency);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, currency);
                            }
                        }
                    }
                }
            }
        });
    }
}

// Enhanced UI Manager with chart support
UIManager.prototype.renderCharts = async function(categoryTotals, year, month) {
    if (!this.chartManager) {
        this.chartManager = new ChartManager();
    }

    try {
        this.chartManager.destroyAll();
        
        const monthlyTotals = await db.getMonthlyTotals(year);
        const weeklyTotals = await db.getWeeklyTotals(year, month);

        await this.chartManager.createCategoryChart(categoryTotals, this.currency);
        await this.chartManager.createTrendChart(monthlyTotals, year, this.currency);
    } catch (error) {
        console.error('Error rendering charts:', error);
    }
};

UIManager.prototype.renderWeeklyChart = async function(year) {
    if (!this.chartManager) {
        this.chartManager = new ChartManager();
    }

    try {
        const { month } = Utils.getCurrentMonthYear();
        const weeklyTotals = await db.getWeeklyTotals(year, month);
        await this.chartManager.createWeeklyChart(weeklyTotals, year, month, this.currency);
    } catch (error) {
        console.error('Error rendering weekly chart:', error);
    }
};

UIManager.prototype.renderComparisonChart = async function(monthlyTotals) {
    if (!this.chartManager) {
        this.chartManager = new ChartManager();
    }

    try {
        await this.chartManager.createComparisonChart(monthlyTotals, this.currency);
    } catch (error) {
        console.error('Error rendering comparison chart:', error);
    }
};

UIManager.prototype.renderCategoryStats = async function() {
    try {
        const { year, month } = Utils.getCurrentMonthYear();
        const categoryTotals = await db.getCategoryTotals(year, month);
        const allExpenses = await db.getAllExpenses();
        const categories = await db.getAllCategories();
        
        const container = document.getElementById('categoryStats');
        let html = '<table class="table table-striped"><thead><tr><th>Category</th><th>Total</th><th>Count</th><th>Avg</th></tr></thead><tbody>';

        categories.forEach(cat => {
            const spent = categoryTotals[cat.name] || 0;
            const expenses = allExpenses.filter(e => e.category === cat.name);
            const count = expenses.length;
            const avg = count > 0 ? spent / count : 0;

            html += `<tr>
                <td><span class="badge" style="background-color: ${cat.color}">${cat.emoji} ${cat.name}</span></td>
                <td>${Utils.formatCurrency(spent, this.currency)}</td>
                <td>${count}</td>
                <td>${Utils.formatCurrency(avg, this.currency)}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering category stats:', error);
    }
};
