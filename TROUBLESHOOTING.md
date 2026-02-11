# Troubleshooting Guide

## Jobs Not Showing in Dashboard

If you're not seeing jobs in the dashboard or jobs page, follow these steps:

### Step 1: Clear Browser Storage (MOST COMMON FIX)

Your authentication token might be outdated. Clear it:

1. Open your browser where the app is running (http://localhost:3000)
2. Press **F12** to open Developer Tools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Find **Local Storage** → **http://localhost:3000**
5. Delete the **"auth-storage"** entry
6. **Refresh the page (F5)**
7. **Log in again** with your credentials

### Step 2: Verify Database Has Jobs

Run this command to reseed the database:
```bash
npm run reseed-force
```

Or use the batch file:
```bash
RESEED_JOBS.bat
```

### Step 3: Restart the Server

Stop the server (Ctrl+C) and restart:
```bash
npm run dev
```

### Step 4: Check Server is Running

Make sure both servers are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Step 5: Create a New Account

If the issue persists, try registering a new account with:
- Strong password (12+ chars, uppercase, special character)
- Valid email

## Common Issues

### "Token is not valid" Error
- Clear browser storage (Step 1 above)
- Log in again

### "No jobs found"
- Run database reseed (Step 2 above)
