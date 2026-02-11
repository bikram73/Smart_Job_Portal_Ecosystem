# Quick Deployment Guide

## Why Registration Fails on Vercel

**Problem**: Vercel only hosts the frontend. The backend API is not deployed.

**Solution**: Deploy backend separately (5 minutes with Railway)

## Quick Fix (Railway - Easiest)

### 1. Deploy Backend (2 minutes)
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Set **Root Directory** to `server`
5. Add these environment variables:
   ```
   PORT=5000
   JWT_SECRET=change_this_to_something_secure_123456
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. Click Deploy

### 2. Connect Frontend to Backend (2 minutes)
1. Copy your Railway URL (e.g., `https://xyz.railway.app`)
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Add new variable:
   ```
   Name: VITE_API_URL
   Value: https://xyz.railway.app/api
   ```
4. Go to Deployments → Redeploy

### 3. Test (1 minute)
1. Visit your Vercel URL
2. Try to register
3. Should work now! 🎉

## That's It!

Your app is now fully deployed:
- ✅ Frontend on Vercel
- ✅ Backend on Railway
- ✅ Registration working
- ✅ All features functional

## Important Note

⚠️ SQLite database will reset on Railway restarts. For production:
- Use Railway's PostgreSQL (free)
- Or use Render with persistent disk

See `DEPLOY_BACKEND.md` for detailed instructions.
