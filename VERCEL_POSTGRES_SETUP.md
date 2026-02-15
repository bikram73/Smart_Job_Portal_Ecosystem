# Vercel PostgreSQL Setup Guide

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project (or create one)

2. **Create Database**
   - Click on "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name: `job-portal-db`
   - Select region: Choose closest to your users
   - Click "Create"

3. **Get Connection String**
   After creation, Vercel will show you environment variables:
   
   ```
   POSTGRES_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com/verceldb"
   POSTGRES_USER="default"
   POSTGRES_HOST="xxxxx-pooler.us-east-1.postgres.vercel-storage.com"
   POSTGRES_PASSWORD="xxxxx"
   POSTGRES_DATABASE="verceldb"
   ```

   **Copy the `POSTGRES_URL` value!**

## Step 2: Configure Local Environment

1. **Update `server/.env`**
   ```env
   PORT=5000
   JWT_SECRET=my_super_secret_jwt_key_change_in_production_12345
   CLIENT_URL=http://localhost:3000
   
   # Add this line with your Vercel Postgres URL
   POSTGRES_URL=postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
   ```

2. **Restart the server**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

3. **Verify Connection**
   You should see:
   ```
   PostgreSQL Database Connected  ← Success!
   Database synced
   ✓ Server running on http://localhost:5000
   ```

## Step 3: Migrate Data (Optional)

If you want to keep your existing users and data:

1. **Export from SQLite**
   ```bash
   cd server
   node export-data.js
   ```

2. **Import to PostgreSQL**
   ```bash
   node import-data.js
   ```

Or start fresh - PostgreSQL will auto-create tables and seed jobs!

## Step 4: Configure Vercel Deployment

1. **Go to Vercel Project Settings**
   - Settings → Environment Variables

2. **Add Environment Variables**
   ```
   JWT_SECRET = my_super_secret_jwt_key_change_in_production_12345
   NODE_ENV = production
   POSTGRES_URL = postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
   ```

3. **Redeploy**
   - Go to Deployments
   - Click "Redeploy"
   - Or push to GitHub (auto-deploys)

## Step 5: Verify Deployment

1. **Check Vercel Logs**
   - Deployments → Latest → Functions → View Logs
   - Should see: "PostgreSQL Database Connected"

2. **Test Registration**
   - Visit your Vercel URL
   - Try to register a new account
   - Should work!

## Troubleshooting

### "Connection refused"
- Check POSTGRES_URL is correct
- Verify Vercel Postgres is active
- Check region/firewall settings

### "SSL required"
- Already configured in code
- Vercel Postgres requires SSL (enabled by default)

### "Tables not created"
- Check Sequelize sync is running
- Look for errors in Vercel logs
- Tables auto-create on first connection

### "Data not persisting"
- Verify POSTGRES_URL is set in Vercel
- Check it's not falling back to SQLite
- Look for "PostgreSQL Database Connected" in logs

## Benefits of PostgreSQL on Vercel

✅ Data persists across deployments
✅ No more database resets
✅ Better performance
✅ Supports concurrent connections
✅ Production-ready
✅ Free tier: 60 hours compute/month, 256 MB storage

## Rollback to SQLite

If needed, simply remove `POSTGRES_URL` from `.env` and restart.
The app will automatically fall back to SQLite.

## Next Steps

1. ✅ Create Vercel Postgres database
2. ✅ Add POSTGRES_URL to local `.env`
3. ✅ Test locally
4. ✅ Add POSTGRES_URL to Vercel environment variables
5. ✅ Deploy to Vercel
6. ✅ Test production deployment

Your data will now persist across all deployments! 🎉
