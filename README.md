# 💰 Expense Tracker PWA

A full-featured, offline-first Progressive Web App (PWA) for tracking personal expenses. Works seamlessly on web browsers, Android, and iOS devices with no backend required.

## ✨ Features

### Core Functionality
- ✅ **Add/Edit/Delete Expenses** - Full CRUD operations with date, amount, category
- ✅ **Multiple Categories** - Pre-defined categories with custom colors and emojis
- ✅ **Expense Search & Filtering** - Filter by category, date, and description
- ✅ **Multi-Currency Support** - 10+ currencies (USD, EUR, GBP, INR, etc.)
- ✅ **Recurring Expenses** - Set up daily, weekly, monthly, or yearly expenses
- ✅ **Expense Tags** - Organize expenses with custom tags
- ✅ **Notes & Descriptions** - Add detailed notes to each expense

### Analytics & Insights
- 📊 **Dashboard with Stats** - Total spent, budget remaining, average daily spending
- 📈 **Spending Charts** - Category breakdown (pie chart), monthly trends (line chart)
- 📉 **Weekly Analysis** - Weekly spending patterns and comparison
- 💹 **Category Statistics** - Per-category totals, counts, and averages
- 📅 **Monthly Comparison** - Compare spending across months and years
- 📊 **Visual Analytics** - Multiple chart types powered by Chart.js

### Budget Management
- 💼 **Set Category Budgets** - Define monthly budgets per category
- 🎯 **Budget Alerts** - Visual indicators for budget status (good/warning/danger)
- 📌 **Budget Tracking** - See how much you've spent vs. budgeted

### PWA & Offline
- 📱 **Install as App** - Add to home screen on Android and iOS
- 🔒 **Offline Access** - Full functionality without internet connection
- 💾 **Automatic Sync** - Service Worker caches all data locally
- ⚡ **Fast Performance** - Instant loading and smooth interactions
- 🌐 **Works Everywhere** - Desktop, tablet, and mobile

### Data Management
- 📥 **Import Data** - Load expenses from CSV or JSON backup files
- 📤 **Export Data** - Download as JSON, CSV, or PDF
- 💾 **Full Backups** - Export all data (expenses, categories, budgets, settings)
- 🔄 **Restore Data** - Seamlessly restore from backups
- 🗑️ **Clear Data** - Securely delete all data with confirmation

### User Experience
- 🌓 **Dark/Light Mode** - Automatic or manual theme selection
- 📱 **Responsive Design** - Mobile-first design works on all screen sizes
- 🎨 **Beautiful UI** - Bootstrap 5 + Custom CSS with smooth animations
- ⌨️ **Keyboard Shortcuts** - Quick entry and navigation
- 🔔 **Notifications** - Visual feedback for all actions

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup only)
- GitHub account (for hosting on GitHub Pages)

### Installation

#### Option 1: Direct Installation (Local Testing)
1. **Clone or Download** the project
2. **Navigate** to the project folder
3. **Open** `index.html` in a browser (or use a local server for best results)
4. **Install** the app when prompted in the browser

#### Option 2: Deploy to GitHub Pages (Recommended)

##### Step 1: Create GitHub Repository
```bash
# Go to https://github.com/new and create a new repository
# Name: expense-tracker
# Description: Personal Expense Tracker PWA
# Make it Public
# Click "Create repository"
```

##### Step 2: Initialize Local Git Repository
```bash
cd /home/rbsol/Projects/expense-tracker
git init
git add .
git commit -m "Initial commit: Expense Tracker PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

##### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**
5. Wait a few minutes, then visit: `https://YOUR_USERNAME.github.io/expense-tracker/`

##### Step 4: Configure Custom Domain (Optional)
1. In Settings → Pages, under "Custom domain", enter your domain
2. Add CNAME record to your domain DNS if needed

#### Option 3: Deploy with Netlify (One-Click Deploy)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.

# Or drag and drop the folder to Netlify
```

## 📲 Installing as PWA

### On Android
1. Open the app in Chrome
2. Tap menu (⋮) → "Install app"
3. Or tap the install prompt that appears
4. App will appear on home screen

### On iOS
1. Open the app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App will appear on home screen

### On Desktop
1. Open in Chrome/Edge
2. Click the install icon (⬇️) in address bar
3. Or use the in-app install prompt

## 💾 Data Storage

### IndexedDB Database
- **Expenses**: All transactions with metadata
- **Categories**: Custom spending categories
- **Budgets**: Monthly budget limits per category
- **Settings**: App preferences and configurations
- **Recurring Expenses**: Automated recurring transactions

### Storage Limits
- Browser: ~50MB+ available for IndexedDB
- Data syncs across all app instances on same device
- Data persists even after clearing browser cache

## 📊 Usage Guide

### Adding Expenses
1. Click **"+ Add Expense"** button or menu
2. Fill in:
   - **Date**: When you spent the money
   - **Amount**: How much was spent
   - **Category**: Pick or create category
   - **Description**: What you bought (optional)
   - **Notes**: Additional details (optional)
   - **Tags**: Quick labels for searching
3. Check **"Recurring"** if it happens regularly
4. Click **"Save Expense"**

### Setting Budgets
1. Go to **Dashboard**
2. Click **"+ Add Budget"**
3. Select category and amount
4. Click **"Save Budget"**
5. Progress bars show current spending vs. budget

### Viewing Analytics
1. Go to **Dashboard** for quick overview
2. Go to **Statistics** for detailed analysis
3. Charts show:
   - Category breakdown
   - Monthly trends
   - Weekly patterns
   - 3-month comparison

### Exporting Data
1. Click menu (☰) → **"Import/Export"**
2. Choose export format:
   - **JSON**: Full backup of everything
   - **CSV**: Excel-compatible spreadsheet
   - **PDF**: Printable report
3. File downloads automatically

### Importing Data
1. Click menu (☰) → **"Import/Export"**
2. Click **"Choose File"**
3. Select JSON or CSV file
4. Click **"Import"**
5. Data merges with existing entries

## ⚙️ Settings

### Currency
- Default: USD ($)
- Options: EUR, GBP, JPY, INR, AUD, CAD, CHF, CNY, MXN
- Change in **Settings → Currency**

### Theme
- **Light**: Bright, clean interface
- **Dark**: Easy on eyes in low light
- **Auto**: Matches system preference
- Change in **Settings → Theme**

### Notifications
- Enable/disable budget alerts
- Works both online and offline
- Change in **Settings → Notifications**

### Fiscal Year Start
- Choose when your financial year begins
- Affects year-to-date calculations
- Change in **Settings → Fiscal Year**

## 🔒 Privacy & Security

- ✅ **100% Offline** - No data sent to servers
- ✅ **Client-Side Only** - All processing happens in your browser
- ✅ **Local Storage** - Data stored only on your device
- ✅ **No Tracking** - No analytics or cookies
- ✅ **No Ads** - Completely ad-free
- ✅ **No Registration** - Use immediately without account
- ✅ **Full Control** - Export or delete data anytime

## 🛠️ Development

### Project Structure
```
expense-tracker/
├── index.html                 # Main HTML file
├── manifest.json              # PWA configuration
├── service-worker.js          # Offline support
├── assets/
│   ├── css/style.css          # Styling
│   └── js/
│       ├── db.js              # Database layer
│       ├── utils.js           # Utility functions
│       ├── ui.js              # UI management
│       ├── charts.js          # Chart integration
│       └── app.js             # Main application
└── README.md                  # This file
```

### Adding New Features

#### Add New Category
Edit `assets/js/utils.js`:
```javascript
static defaultCategories = [
    { name: 'New', emoji: '🆕', color: '#FF0000' },
    // ... more categories
];
```

#### Add New Currency
Edit `assets/js/utils.js`:
```javascript
static currencies = {
    'NEW': { symbol: '₦', name: 'New Currency' },
    // ... more currencies
};
```

#### Customize Colors
Edit `assets/css/style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... */
}
```

### Building & Deployment

#### Local Testing with Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then visit: http://localhost:8000
```

#### Check PWA Compliance
- Open Chrome DevTools (F12)
- Go to **Lighthouse** tab
- Run audit for PWA
- Fix any issues

#### Optimize for Production
- Minify CSS and JavaScript
- Optimize images
- Enable gzip compression
- Set up CDN for faster delivery

## 📱 Browser Support

| Browser | Desktop | Mobile | PWA |
|---------|---------|--------|-----|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ |
| Safari | ✅ | ✅ | ⚠️ |
| Edge | ✅ | ✅ | ✅ |
| Samsung Internet | - | ✅ | ✅ |

## 🐛 Troubleshooting

### App Won't Install
- **Solution**: Clear browser cache and try again
- Check that manifest.json is correctly linked in index.html
- Ensure HTTPS is used (required for PWA)

### Data Not Persisting
- **Solution**: Check browser privacy settings
- Ensure IndexedDB is enabled
- Try a different browser or clear private mode

### Charts Not Showing
- **Solution**: Refresh the page
- Check browser console for errors (F12 → Console)
- Ensure Chart.js library loaded

### Import Fails
- **Solution**: Verify file format (JSON or CSV)
- Check file encoding is UTF-8
- Ensure data structure matches export format

### Offline Access Not Working
- **Solution**: Service Worker must be registered
- Visit app once online to cache assets
- Check Settings → Developer Tools → Application → Service Workers

## 📈 Future Enhancements

- 🔐 Cloud backup with encryption
- 💱 Real-time currency conversion
- 👥 Multi-user support with sync
- 📧 Email reports and summaries
- 📱 iOS native app
- 🎯 Advanced budgeting features
- 💳 Bank account integration
- 📊 Advanced reporting and forecasting

## 📄 License

This project is open source and available under the MIT License. Feel free to fork, modify, and use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

- **Issues**: Report bugs or request features on GitHub Issues
- **Documentation**: Read this README and in-code comments
- **Tips**: Check the Settings panel for helpful tips

## 🙏 Credits

Built with:
- [Bootstrap 5](https://getbootstrap.com/) - UI Framework
- [Chart.js](https://www.chartjs.org/) - Chart Visualization
- [jsPDF](https://github.com/parallax/jsPDF) - PDF Generation
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Local Storage

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Core expense tracking functionality
- ✅ Multiple categories and budgets
- ✅ Comprehensive analytics and charts
- ✅ Full PWA support with offline access
- ✅ Import/Export functionality
- ✅ Dark/Light theme support
- ✅ Multi-currency support
- ✅ Mobile-responsive design

---

**Made with ❤️ for personal finance management**

🚀 [Visit App](https://YOUR_USERNAME.github.io/expense-tracker/) | 📖 [Read Docs](#) | 🐛 [Report Bug](#) | 💡 [Request Feature](#)
