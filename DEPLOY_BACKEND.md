# Deploy Backend to Railway

## Why Registration is Failing on Vercel

**The Problem:**
- Vercel only hosts the frontend (React app)
- The backend API is NOT deployed
- When you try to register, the frontend tries to call `/api/auth/register`
- But there's no backend server to handle the request
- Result: Registration fails

**The Solution:**
Deploy the backend separately and connect it to the frontend.

## Step-by-Step: Deploy Backend to Railway

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub (free tier available)

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `Smart_Job_Portal_Ecosystem` repository
- Railway will detect it's a Node.js app

### 3. Configure the Service
- **Root Directory**: Set to `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
Click "Variables" and add:
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
```

### 5. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Railway will give you a URL like: `https://your-app.railway.app`

### 6. Update Frontend on Vercel
- Go to your Vercel project settings
- Add Environment Variable:
  ```
  VITE_API_URL=https://your-app.railway.app/api
  ```
- Redeploy the frontend

### 7. Update CORS on Backend
Edit `server/server.js` to allow your Vercel domain:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

## Alternative: Deploy Backend to Render

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up (free tier available)

### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect GitHub repository
- Select your repo

### 3. Configure
- **Name**: smart-job-portal-api
- **Root Directory**: `server`
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
```
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### 5. Deploy and Connect
- Deploy the service
- Copy the URL (e.g., `https://smart-job-portal-api.onrender.com`)
- Add to Vercel as `VITE_API_URL`

## Important Notes

### Database Consideration
⚠️ **SQLite is NOT recommended for production!**

Railway and Render use ephemeral file systems, meaning:
- Your SQLite database will be deleted on each deployment
- All user data will be lost

**Solutions:**
1. **Use PostgreSQL** (Recommended)
   - Railway offers free PostgreSQL
   - Render offers free PostgreSQL
   - Update Sequelize config to use PostgreSQL

2. **Use Railway Volume** (for SQLite)
   - Mount a persistent volume for the database file
   - More complex setup

### Migrate to PostgreSQL (Recommended)

1. Install PostgreSQL driver:
```bash
cd server
npm install pg pg-hstore
```

2. Update `server/config/database.js`:
```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  dialect: 'sqlite',
  storage: './database.sqlite'
});
```

3. Add `DATABASE_URL` to Railway/Render environment variables

## Testing the Deployment

After deploying both frontend and backend:

1. Visit your Vercel URL
2. Try to register a new account
3. If successful, you should be able to:
   - Log in
   - See jobs
   - Create applications
   - Build resumes

## Troubleshooting

### "Network Error" on registration
- Backend is not deployed or not running
- Check Railway/Render logs
- Verify `VITE_API_URL` is set correctly on Vercel

### "CORS Error"
- Update CORS settings in `server/server.js`
- Add your Vercel domain to allowed origins

### "Database not found"
- Backend needs to seed the database
- SSH into Railway/Render and run: `npm run reseed-force`
- Or add seeding to the start script

### Jobs not showing after deployment
- Backend database is empty
- Run seed script on the deployed backend
- Consider auto-seeding on first run (already implemented!)

## Quick Deploy Checklist

- [ ] Deploy backend to Railway/Render
- [ ] Add environment variables to backend
- [ ] Get backend URL
- [ ] Add `VITE_API_URL` to Vercel
- [ ] Update CORS in backend
- [ ] Redeploy frontend on Vercel
- [ ] Test registration
- [ ] Test login
- [ ] Verify jobs are showing
