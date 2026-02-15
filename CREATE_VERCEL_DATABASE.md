# How to Create PostgreSQL Database in Vercel

## 📋 Prerequisites
- Vercel account (free tier works!)
- Your project deployed on Vercel (or ready to deploy)

## 🎯 Step-by-Step Guide

### Step 1: Go to Vercel Dashboard
1. Open your browser
2. Go to: **https://vercel.com**
3. Click **"Login"** (top right)
4. Sign in with GitHub/GitLab/Email

### Step 2: Select Your Project
1. You'll see your dashboard with all projects
2. Click on your project: **"Smart_Job_Portal_Ecosystem"**
   - If you haven't deployed yet, click **"Add New"** → **"Project"** → Import from GitHub

### Step 3: Open Storage Tab
1. In your project dashboard, look at the top navigation tabs:
   ```
   Overview | Deployments | Analytics | Logs | Settings | Storage
   ```
2. Click on **"Storage"** tab

### Step 4: Create Database
1. You'll see a page with storage options
2. Click the **"Create Database"** button (blue button)
3. You'll see database options:
   - **Postgres** ← Select this one!
   - KV (Redis)
   - Blob
   - Edge Config

### Step 5: Configure Database
1. **Database Name**: Enter `job-portal-db` (or any name you like)
2. **Region**: Select closest to your users
   - `us-east-1` (US East - Virginia)
   - `us-west-1` (US West - California)
   - `eu-central-1` (Europe - Frankfurt)
   - `ap-southeast-1` (Asia - Singapore)
3. Click **"Create"** button

### Step 6: Wait for Creation
- Takes 10-30 seconds
- You'll see a loading spinner
- Don't close the page!

### Step 7: Copy Connection Details
After creation, you'll see a page with environment variables:

```env
POSTGRES_URL="postgres://default:AbCdEf123456@ep-cool-name-123456-pooler.us-east-1.postgres.vercel-storage.com/verceldb"

POSTGRES_PRISMA_URL="postgres://default:AbCdEf123456@ep-cool-name-123456-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"

POSTGRES_URL_NON_POOLING="postgres://default:AbCdEf123456@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com/verceldb"

POSTGRES_USER="default"

POSTGRES_HOST="ep-cool-name-123456-pooler.us-east-1.postgres.vercel-storage.com"

POSTGRES_PASSWORD="AbCdEf123456"

POSTGRES_DATABASE="verceldb"
```

**Important:** Copy the **`POSTGRES_URL`** value (the first one)!

### Step 8: Add to Your Project

#### Option A: Automatic (Recommended)
1. Vercel will ask: **"Add these to your project?"**
2. Click **"Add to Project"**
3. Select your project from dropdown
4. Click **"Add"**
5. Done! ✅

#### Option B: Manual
1. Go to your project **Settings** tab
2. Click **"Environment Variables"** (left sidebar)
3. Click **"Add New"**
4. Enter:
   - **Key**: `POSTGRES_URL`
   - **Value**: `postgres://default:xxxxx@xxxxx.vercel.app/verceldb`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **"Save"**

### Step 9: Redeploy Your Project
1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"..."** (three dots menu)
4. Click **"Redeploy"**
5. Wait for deployment to complete

### Step 10: Verify It Works
1. Visit your deployed URL
2. Try to register a new account
3. Check deployment logs:
   - Go to **Deployments** → Latest → **Functions**
   - Click on `/api/index.js`
   - Look for: `PostgreSQL Database Connected` ✅

## 🎉 Success!

Your Vercel project now uses PostgreSQL!

## 📊 What You Get (Free Tier)

| Feature | Free Tier |
|---------|-----------|
| Storage | 256 MB |
| Compute | 60 hours/month |
| Rows | ~500,000 |
| Connections | 60 concurrent |
| Backups | Automatic |
| SSL | Included |

Perfect for development and small projects!

## 🔧 Local Development Setup

Now update your local `.env` file:

1. Open `server/.env`
2. Add the POSTGRES_URL:
   ```env
   PORT=5000
   JWT_SECRET=my_super_secret_jwt_key_change_in_production_12345
   CLIENT_URL=http://localhost:3000
   
   # Add this line (use the URL from Vercel)
   POSTGRES_URL=postgres://default:xxxxx@xxxxx.vercel.app/verceldb
   ```
3. Save the file
4. Restart your server:
   ```bash
   npm run dev
   ```
5. You should see: `PostgreSQL Database Connected` ✅

## 🆘 Troubleshooting

### Can't find "Storage" tab?
- Make sure you're in a project (not the main dashboard)
- Storage tab is only visible inside a project

### "Create Database" button disabled?
- You might have reached the free tier limit (1 database)
- Delete unused databases first
- Or upgrade to Pro plan

### Database creation failed?
- Try a different region
- Check your Vercel account is verified
- Contact Vercel support

### Connection string not working?
- Make sure you copied the full URL
- Check for extra spaces or line breaks
- Verify the URL starts with `postgres://`

## 📱 Quick Access

**Vercel Dashboard:** https://vercel.com/dashboard

**Your Databases:** 
1. Dashboard → Select Project → Storage tab
2. You'll see all your databases listed

**Manage Database:**
- View connection details
- Monitor usage
- Delete database
- View metrics

## 🎯 Next Steps

1. ✅ Database created in Vercel
2. ✅ Connection string copied
3. ⏭️ Add to local `.env` file
4. ⏭️ Add to Vercel environment variables
5. ⏭️ Test locally
6. ⏭️ Deploy to Vercel
7. ⏭️ Verify production works

## 💡 Pro Tips

- **Use the same database** for local development and production
- **Don't commit** the POSTGRES_URL to Git (it's in .env which is gitignored)
- **Backup regularly** (Vercel does this automatically)
- **Monitor usage** in Vercel dashboard to avoid hitting limits

## 🔗 Useful Links

- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Vercel Dashboard: https://vercel.com/dashboard
- Pricing: https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing

---

Need help? Check `VERCEL_POSTGRES_SETUP.md` for more details!
