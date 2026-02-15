# PostgreSQL Migration Guide

## Why Migrate to PostgreSQL?

- ✅ Persistent data (SQLite resets on Vercel deployments)
- ✅ Better performance for production
- ✅ Supports concurrent connections
- ✅ Free tier available on Vercel

## Quick Setup with Vercel Postgres

### 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., `job-portal-db`)
6. Select region closest to your users
7. Click "Create"

### 2. Get Connection String

After creation, Vercel will show you environment variables:
- `POSTGRES_URL` - Full connection string
- `POSTGRES_PRISMA_URL` - For Prisma (not needed)
- `POSTGRES_URL_NON_POOLING` - Direct connection

Copy the `POSTGRES_URL` value.

### 3. Add to Environment Variables

**For Vercel Deployment:**
1. Go to Project Settings → Environment Variables
2. Add: `POSTGRES_URL` = `postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com/verceldb`
3. Redeploy

**For Local Development:**
1. Create/edit `server/.env`
2. Add: `POSTGRES_URL=postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com/verceldb`
3. Restart server

### 4. Test Connection

```bash
cd server
npm start
```

You should see: `PostgreSQL Database Connected`

## Alternative: Local PostgreSQL

### Install PostgreSQL Locally

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Remember the password you set

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql
sudo service postgresql start
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE job_portal;

# Create user (optional)
CREATE USER job_portal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE job_portal TO job_portal_user;

# Exit
\q
```

### Configure Connection

Add to `server/.env`:
```
POSTGRES_URL=postgresql://postgres:your_password@localhost:5432/job_portal
```

Or with custom user:
```
POSTGRES_URL=postgresql://job_portal_user:your_password@localhost:5432/job_portal
```

## How It Works

The app automatically detects which database to use:

```javascript
// server/config/database.js
if (process.env.POSTGRES_URL) {
  // Use PostgreSQL
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    ...
  });
} else {
  // Use SQLite (fallback)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    ...
  });
}
```

## Migration Steps

### From SQLite to PostgreSQL

1. **Backup SQLite data** (if needed):
   ```bash
   # Export users and jobs from SQLite
   # (Manual process - copy important data)
   ```

2. **Set POSTGRES_URL**:
   - Add to `.env` file
   - Or set in Vercel environment variables

3. **Restart server**:
   ```bash
   npm run dev
   ```

4. **Database auto-creates tables**:
   - Sequelize automatically creates all tables
   - Schema is synced from models

5. **Seed data**:
   ```bash
   npm run reseed-force
   ```

## Verify Migration

### Check Connection
```bash
cd server
node test-api.js
```

Should show:
```
PostgreSQL Database Connected
✓ Jobs in database: 16
✓ Users in database: X
```

### Test API
Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Troubleshooting

### "Connection refused"
- PostgreSQL is not running
- Check connection string is correct
- Verify firewall allows connection

### "SSL required"
- Vercel Postgres requires SSL
- Already configured in `database.js`

### "Database does not exist"
- Create database first: `CREATE DATABASE job_portal;`
- Or use existing database name in connection string

### "Authentication failed"
- Check username and password
- Verify user has permissions

### Tables not created
- Check Sequelize sync is running
- Look for errors in console
- Try `{ force: true }` to recreate tables (WARNING: deletes data)

## Production Checklist

- [ ] POSTGRES_URL set in Vercel
- [ ] Database created and accessible
- [ ] Connection tested successfully
- [ ] Tables created (auto-sync)
- [ ] Sample data seeded
- [ ] API endpoints working
- [ ] Frontend can connect

## Benefits After Migration

✅ Data persists across deployments
✅ No more database resets
✅ Better performance
✅ Supports multiple connections
✅ Production-ready
✅ Free tier on Vercel (60 hours compute/month)

## Rollback to SQLite

If needed, simply remove `POSTGRES_URL` from environment variables and restart.

The app will automatically fall back to SQLite.
