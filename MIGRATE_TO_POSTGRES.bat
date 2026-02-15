@echo off
color 0E
echo ============================================
echo   MIGRATE TO POSTGRESQL
echo ============================================
echo.
echo This will help you migrate from SQLite to PostgreSQL
echo.
echo Step 1: Export current data from SQLite
echo ----------------------------------------
cd server
node export-data.js
cd ..
echo.
echo ============================================
echo   NEXT STEPS:
echo ============================================
echo.
echo 1. Go to Vercel Dashboard
echo    https://vercel.com/dashboard
echo.
echo 2. Create Postgres Database:
echo    - Click "Storage" tab
echo    - Click "Create Database"
echo    - Select "Postgres"
echo    - Name it: job-portal-db
echo    - Click "Create"
echo.
echo 3. Copy the POSTGRES_URL value
echo.
echo 4. Add to server/.env file:
echo    POSTGRES_URL=postgres://default:xxxxx@xxxxx.vercel.app/verceldb
echo.
echo 5. Restart the server:
echo    npm run dev
echo.
echo 6. Import data (optional):
echo    cd server
echo    node import-data.js
echo.
echo 7. Add POSTGRES_URL to Vercel:
echo    - Project Settings
echo    - Environment Variables
echo    - Add POSTGRES_URL
echo    - Redeploy
echo.
echo ============================================
pause
