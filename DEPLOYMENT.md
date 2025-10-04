# 🚀 GitHub Deployment Guide

This guide will help you deploy your NASA Farming Game to GitHub Pages.

## 📋 Prerequisites

1. **GitHub Account** - You need a GitHub account
2. **Git Repository** - Your code should be in a GitHub repository
3. **Node.js** - For building the project (v18 or higher recommended)

## 🛠️ Setup Steps

### 1. Repository Setup

1. Create a new repository on GitHub (or use existing one)
2. Clone your repository locally:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main branch

### 3. Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys your game when you push to the main branch.

**What happens automatically:**

- ✅ Builds the project using Vite
- ✅ Deploys to GitHub Pages
- ✅ Updates live site on every push to main

**To deploy:**

```bash
git add .
git commit -m "Deploy game to GitHub Pages"
git push origin main
```

### 4. Manual Deployment (Alternative)

If you prefer manual deployment:

1. Install gh-pages:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Deploy:

   ```bash
   npm run deploy
   ```

3. Go to repository Settings → Pages and select "Deploy from a branch" → "gh-pages"

## 🌐 Access Your Game

After deployment, your game will be available at:

```
https://yourusername.github.io/your-repo-name/
```

## 🔧 Configuration Files

The following files are configured for GitHub deployment:

- **`vite.config.js`** - Sets base path to `./` for relative asset loading
- **`.github/workflows/deploy.yml`** - Automated deployment workflow
- **`package.json`** - Build and deploy scripts
- **All asset paths** - Updated to use relative paths (`./assets/`)

## 🐛 Troubleshooting

### Assets Not Loading

- ✅ All asset paths have been updated to use relative paths (`./assets/`)
- ✅ Vite config sets `base: './'` for proper GitHub Pages deployment

### Build Errors

- Check that all asset files exist in the correct paths
- Verify Node.js version (18+ recommended)
- Run `npm install` to ensure dependencies are installed

### Deployment Not Working

- Check GitHub Actions tab in your repository for error logs
- Ensure the workflow file is in `.github/workflows/deploy.yml`
- Verify repository settings have GitHub Pages enabled

### Game Not Loading

- Check browser console for JavaScript errors
- Verify all asset files are properly committed to the repository
- Test locally with `npm run build && npm run preview`

## 📁 File Structure After Deployment

```
your-repo/
├── .github/workflows/deploy.yml  # Auto-deployment
├── src/                          # Source code
├── public/assets/                # Static assets
├── dist/                         # Built files (auto-generated)
├── vite.config.js               # Build configuration
└── package.json                 # Dependencies & scripts
```

## 🎯 Best Practices

1. **Test Locally First**

   ```bash
   npm run build
   npm run preview
   ```

2. **Commit All Changes**

   - Ensure all asset files are committed
   - Test the built version before pushing

3. **Monitor Deployments**
   - Check GitHub Actions for build status
   - Test the live site after deployment

## 🔄 Updates

To update your deployed game:

1. Make changes to your code
2. Commit and push to main branch
3. GitHub Actions will automatically rebuild and redeploy
4. Your changes will be live in a few minutes

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Open an issue in your repository
4. Test locally to isolate the problem

---

**Your NASA Farming Game is now ready for global deployment! 🌍🎮**
