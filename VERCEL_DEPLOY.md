# Deploy Full Stack App on Vercel

## Overview

This project is now configured to deploy both frontend and backend on Vercel as a monorepo.

## What Gets Deployed

- ✅ Frontend (React) - Static files
- ✅ Backend (Express API) - Serverless functions
- ✅ Database (SQLite) - In-memory (resets on each deployment)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel full-stack deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 3. Configure Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables:

```
JWT_SECRET=your_super_secret_jwt_key_change_this_12345
NODE_ENV=production
```

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Your app will be live!

## How It Works

### Frontend
- Built from `client/` folder
- Deployed as static files
- Served from `/`

### Backend API
- Runs from `api/index.js`
- Deployed as serverless function
- All API routes available at `/api/*`

### Database
- SQLite runs in serverless function
- ⚠️ **Important**: Database resets on each deployment
- Data is NOT persistent

## Important Notes

### Database Persistence

⚠️ **SQLite is NOT persistent on Vercel!**

The database will reset:
- On each deployment
- When the serverless function cold starts
- Periodically as Vercel scales down

**Solutions:**

1. **Use Vercel Postgres** (Recommended)
   - Free tier available
   - Persistent storage
   - Easy integration

2. **Use External Database**
   - Supabase (PostgreSQL)
   - PlanetScale (MySQL)
   - MongoDB Atlas

### Migrating to Vercel Postgres

1. Install Vercel Postgres in your project
2. Update `server/config/database.js`:
```javascript
const { sql } = require('@vercel/postgres');
// Use Vercel Postgres instead of SQLite
```

3. Add `@vercel/postgres` to dependencies
4. Redeploy

## Testing

After deployment:
1. Visit your Vercel URL
2. Try to register (will work!)
3. Log in
4. Browse jobs (auto-seeded on first request)

## Troubleshooting

### "Cannot connect to API"
- Check Vercel deployment logs
- Verify `/api/health` endpoint works
- Check browser console for errors

### "Database error"
- SQLite might not work in serverless
- Consider migrating to Vercel Postgres
- Check function logs in Vercel dashboard

### "Jobs not showing"
- Database auto-seeds on first API request
- Refresh the page
- Check `/api/jobs` endpoint directly

### Build fails
- Check all dependencies are in package.json files
- Verify vercel.json configuration
- Check build logs for specific errors

## Local Development

For local development, continue using:
```bash
npm run dev
```

This runs both frontend and backend locally with hot reload.

## Production Considerations

For a production app, you should:

1. ✅ Use persistent database (Vercel Postgres)
2. ✅ Add proper error logging (Sentry, LogRocket)
3. ✅ Set up monitoring (Vercel Analytics)
4. ✅ Add rate limiting
5. ✅ Implement proper authentication refresh
6. ✅ Add database backups
7. ✅ Set up CI/CD tests

## Cost

- Vercel Free Tier includes:
  - Unlimited deployments
  - 100GB bandwidth
  - Serverless function executions
  - Vercel Postgres (limited)

- Upgrade to Pro if you need:
  - More bandwidth
  - More function execution time
  - Team collaboration
  - Advanced analytics
