# 🚀 GitHub Pages Deployment Guide

Complete step-by-step guide to deploy Expense Tracker to GitHub Pages.

## 📋 Prerequisites

- GitHub account (free at github.com)
- Git installed on your computer
- Expense Tracker project folder ready

## ✅ Step-by-Step Setup

### Step 1: Prepare Your GitHub Account

1. Go to https://github.com/new
2. Sign in with your GitHub account (or create one if needed)
3. You'll see the repository creation form

### Step 2: Create the Repository

1. **Repository Name**: `expense-tracker`
2. **Description**: "Personal Expense Tracker PWA - Offline-first app for tracking expenses"
3. **Visibility**: Select `Public` (required for GitHub Pages)
4. Leave other options as default
5. Click **"Create repository"**

You should see a page with setup instructions. Keep this page open.

### Step 3: Initialize Git Locally

Open Terminal/Command Prompt in your project folder:

```bash
# Navigate to project
cd /home/rbsol/Projects/expense-tracker

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Expense Tracker PWA"

# Rename branch to main (if needed)
git branch -M main

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 4: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/expense-tracker`
2. Click **Settings** (top right tab)
3. Scroll down to **Pages** section (on the left menu)
4. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**
6. You should see a message: "Your site is ready to be published at https://YOUR_USERNAME.github.io/expense-tracker/"

### Step 5: Verify Deployment

1. Wait 1-2 minutes for GitHub to build and deploy
2. Visit: `https://YOUR_USERNAME.github.io/expense-tracker/`
3. You should see the Expense Tracker app loading
4. Check the browser console for any errors (F12 → Console)

### Step 6: Test PWA Features

#### Test Service Worker
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** on the left
4. You should see the service worker registered as "Active"

#### Test Offline Access
1. In DevTools, go to **Network** tab
2. Check **"Offline"** at the top
3. Refresh the page (F5)
4. The app should still work without internet!

#### Test Installation
1. Click the install icon (📥) in the address bar
2. Follow the prompts to install
3. The app will appear in your applications

## 🔄 Making Updates

After making changes to your code:

```bash
# Navigate to project
cd /home/rbsol/Projects/expense-tracker

# Check what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

Your changes will be live on GitHub Pages within 1-2 minutes!

## 🌐 Custom Domain (Optional)

To use a custom domain (like expensetracker.com):

### Step 1: Register Domain
- Buy domain from registrar (GoDaddy, Namecheap, etc.)

### Step 2: Configure DNS
Add these DNS records:

For APEX domain (expensetracker.com):
```
Type: A
Name: @
Value: 185.199.108.153
```

Or alternatively:
```
Type: A
Name: @
Value: 185.199.109.153
```

```
Type: A
Name: @
Value: 185.199.110.153
```

```
Type: A
Name: @
Value: 185.199.111.153
```

For subdomain (www.expensetracker.com):
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### Step 3: Add Domain to GitHub

1. Repository → Settings → Pages
2. Under "Custom domain", enter: `expensetracker.com`
3. Click Save
4. Check "Enforce HTTPS"

Wait 24-48 hours for DNS to propagate.

## 📊 Alternative Deployment Options

### Option 1: Netlify (Recommended for Easy Setup)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login (opens browser)
netlify login

# Deploy
netlify deploy --prod --dir=.

# Or drag folder to Netlify dashboard
```

**Pros**: 
- Easier setup than GitHub Pages
- Better analytics
- Free tier generous

**Cons**:
- Need to install Node.js

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: GitHub Pages with GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

This automatically deploys when you push to main!

## 🔐 Security Best Practices

- ✅ Keep your GitHub token secret
- ✅ Don't commit sensitive data
- ✅ Review .gitignore to exclude private files
- ✅ Use HTTPS (GitHub Pages enforces this)
- ✅ Regularly backup your data (export from app)

## 🐛 Troubleshooting

### Site Not Showing
- Wait 2-5 minutes after enabling Pages
- Check repository is public
- Verify branch and folder are correct in Settings

### Service Worker Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check manifest.json is linked in HTML
- Verify service-worker.js exists in root

### 404 Errors on Refresh
- GitHub Pages routes to index.html automatically (no special config needed)
- Try clearing browser cache
- Verify file paths are correct

### CORS Errors
- Expected with Service Worker caching external resources
- Shouldn't affect app functionality
- Check DevTools Console for details

## 📈 Monitor Your Deployment

### GitHub Pages Stats
1. Go to Settings → Pages
2. Scroll down to "GitHub Pages"
3. Click the visit link or deployment history

### Check Build Status
1. Go to Actions tab
2. View deployment logs
3. See if build succeeded or failed

## 📱 Test on Mobile

### iOS (Safari)
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Opens as full-screen app

### Android (Chrome)
1. Open in Chrome
2. Tap menu → Install app
3. Or use in-app install prompt

## 💡 Pro Tips

1. **Auto-sync**: GitHub Desktop app syncs changes automatically
2. **Quick edits**: Edit files directly on GitHub and commit
3. **Branches**: Use branches for features before merging
4. **Releases**: Create releases for version backups
5. **README**: Update README.md with your deployment URL

## 🎯 Next Steps

1. ✅ Deploy to GitHub Pages
2. ✅ Test on multiple devices
3. ✅ Install as PWA
4. ✅ Try offline functionality
5. ✅ Export/import data
6. ✅ Customize settings
7. ✅ Share with friends!

## 📞 Support

If you encounter issues:

1. Check repository for recent changes
2. Review GitHub Pages documentation
3. Check browser console for errors (F12)
4. Try in incognito/private mode
5. Clear cache and retry

---

**Happy tracking! 💰**

For full app documentation, see [README.md](./README.md)
