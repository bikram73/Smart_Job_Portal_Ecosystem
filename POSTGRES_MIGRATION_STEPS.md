# PostgreSQL Migration - Quick Steps

## 🎯 Goal
Migrate from SQLite to PostgreSQL for Vercel deployment

## ⚡ Quick Migration (5 minutes)

### Step 1: Export Current Data (Optional)
```bash
cd server
node export-data.js
```
This creates `data-export.json` with all your users and data.

### Step 2: Create Vercel Postgres Database

1. Go to: https://vercel.com/dashboard
2. Select your project (or create one)
3. Click **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Name: `job-portal-db`
7. Region: Choose closest to you
8. Click **"Create"**

### Step 3: Get Connection String

Vercel will show you environment variables. **Copy the `POSTGRES_URL`:**

```
POSTGRES_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
```

### Step 4: Update Local Environment

Edit `server/.env` and add:

```env
PORT=5000
JWT_SECRET=my_super_secret_jwt_key_change_in_production_12345
CLIENT_URL=http://localhost:3000

# Add this line (replace with your actual URL)
POSTGRES_URL=postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
```

### Step 5: Test Locally

```bash
# Stop current server (Ctrl+C)
npm run dev
```

You should see:
```
PostgreSQL Database Connected  ✓
Database synced
✓ Server running on http://localhost:5000
```

### Step 6: Import Data (Optional)

If you want to keep existing users:
```bash
cd server
node import-data.js
```

Or start fresh - PostgreSQL will auto-seed jobs!

### Step 7: Configure Vercel

1. Go to Vercel Project → **Settings** → **Environment Variables**
2. Add these variables:

```
JWT_SECRET = my_super_secret_jwt_key_change_in_production_12345
NODE_ENV = production
POSTGRES_URL = postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb
```

3. Click **"Save"**

### Step 8: Deploy

```bash
git add .
git commit -m "Migrate to PostgreSQL"
git push origin main
```

Vercel will auto-deploy!

### Step 9: Verify

1. Visit your Vercel URL
2. Try to register a new account
3. Check Vercel logs: Should see "PostgreSQL Database Connected"

## ✅ Done!

Your app now uses PostgreSQL:
- ✅ Data persists across deployments
- ✅ No more database resets
- ✅ Production-ready
- ✅ Better performance

## 🔄 Rollback to SQLite

If needed, just remove `POSTGRES_URL` from `.env` and restart.

## 📊 Current Status

**Before Migration:**
- Database: SQLite
- Location: `server/database.sqlite`
- Users: 5
- Jobs: 16

**After Migration:**
- Database: PostgreSQL (Vercel)
- Location: Cloud (Vercel Postgres)
- Users: Migrated or fresh start
- Jobs: Auto-seeded

## 🆘 Need Help?

See `VERCEL_POSTGRES_SETUP.md` for detailed troubleshooting.

## 🎉 Benefits

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Data Persistence | ❌ Resets on deploy | ✅ Persists |
| Concurrent Users | ⚠️ Limited | ✅ Unlimited |
| Production Ready | ❌ No | ✅ Yes |
| Vercel Compatible | ❌ No | ✅ Yes |
| Backup | Manual file copy | ✅ Automatic |
| Scalability | ❌ Limited | ✅ Excellent |
