# ⚡ Quick Start Guide

## 🎯 Get Running in 5 Minutes

### Option A: Test Locally First (Recommended)

```bash
# 1. Navigate to project
cd /home/rbsol/Projects/expense-tracker

# 2. Start a local server
python -m http.server 8000
# Or: npx http-server

# 3. Open browser
http://localhost:8000

# 4. Test the app!
```

### Option B: Deploy to GitHub Pages (Recommended for Sharing)

```bash
# 1. Create repository on github.com
# Go to https://github.com/new

# 2. Push code to GitHub
cd /home/rbsol/Projects/expense-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main

# 3. Enable Pages
# Settings → Pages → Branch: main → Folder: / (root) → Save

# 4. Visit your app
https://YOUR_USERNAME.github.io/expense-tracker/
```

---

## 📋 What You Get

- 💾 **Full expense tracking** with categories and budgets
- 📊 **Beautiful charts** showing spending patterns
- 📱 **PWA installation** - works as native app on Android/iOS
- 🔒 **100% offline** - no data sent to servers
- 💱 **10+ currencies** supported
- 📤 **Export/Import** data in JSON, CSV, or PDF
- 🌓 **Dark/Light mode** with responsive design

---

## 🚀 First Time Use

1. **Add Categories** (optional - defaults are provided)
   - Menu → Categories → Add Category

2. **Add First Expense**
   - Click "+ Add Expense"
   - Fill details
   - Save

3. **Set Budget** (optional)
   - Dashboard → Add Budget
   - Set monthly limit per category

4. **View Analytics**
   - Dashboard → See charts and stats
   - Statistics → Detailed analysis

5. **Install as PWA**
   - Click install prompt or menu
   - Add to home screen
   - Use offline anytime!

---

## 🔑 Key Features at a Glance

| Feature | Where | How |
|---------|-------|-----|
| Add Expense | Expenses or "+" button | Fill form and save |
| View Charts | Dashboard | Auto-generated from data |
| Set Budget | Dashboard → "Add Budget" | Select category & amount |
| Filter Expenses | Expenses page | Use search & category filter |
| Export Data | Menu → Import/Export | Choose format (JSON/CSV/PDF) |
| Import Data | Menu → Import/Export | Select file and import |
| Change Theme | Menu → Settings → Theme | Pick Light/Dark/Auto |
| Change Currency | Menu → Settings → Currency | Select from 10+ options |

---

## 📱 Install on Android

1. Open app in **Chrome** browser
2. Tap menu (⋮)
3. Tap **"Install app"** or wait for prompt
4. Tap **"Install"** on the popup
5. Done! App on home screen

---

## 📱 Install on iOS

1. Open app in **Safari** browser
2. Tap **Share** button (bottom)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**
5. Done! App on home screen

---

## 💡 Pro Tips

- **Recurring Expenses**: Check "Recurring" when adding expense
- **Tags**: Use comma-separated tags for quick filtering
- **Offline**: Works completely offline after first visit
- **Backup**: Export data regularly to backup
- **Import**: Restore from CSV/JSON anytime
- **Budget Alerts**: Enable in Settings for notifications
- **Sync**: Data syncs across all browser tabs instantly

---

## 🎓 Common Tasks

### Add Recurring Daily Coffee
1. Click "+ Add Expense"
2. Amount: 5
3. Category: Food
4. Description: "Morning Coffee"
5. Check "Recurring"
6. Select: Daily
7. Save

### Export All Data to Backup
1. Menu → Import/Export
2. Click "JSON" button
3. File downloads to computer
4. Keep it safe!

### Restore from Backup
1. Menu → Import/Export
2. Click "Choose File"
3. Select JSON backup
4. Click "Import"
5. Data restored!

### Compare Spending with Last Month
1. Go to Statistics
2. See "Comparison (Last 3 Months)" chart
3. Visual comparison shows trends

---

## ⚙️ Settings Explained

| Setting | Options | What It Does |
|---------|---------|--------------|
| Currency | USD, EUR, GBP, etc. | Changes all currency displays |
| Theme | Light, Dark, Auto | Changes app appearance |
| Notifications | On/Off | Budget alerts enable/disable |
| Fiscal Year | Jan, Apr, Jul | Affects year-to-date calculations |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't load | Clear browser cache, refresh |
| Service Worker won't install | Visit in regular (non-private) mode |
| Data not saving | Check browser storage enabled |
| Charts not showing | Refresh page, check console for errors |
| Can't export | Ensure you have expenses to export |
| Import fails | Verify file format (JSON or CSV) |

---

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.

---

## 🎯 Next Steps

1. ✅ Get app running
2. ✅ Add some expenses
3. ✅ Install as app
4. ✅ Test offline
5. ✅ Share the URL with friends!

---

**Questions?** Check README.md or review in-app help.

**Ready?** Open http://localhost:8000 or visit your GitHub Pages URL! 🚀
