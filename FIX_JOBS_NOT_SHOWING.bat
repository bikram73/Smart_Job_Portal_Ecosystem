@echo off
color 0A
echo ============================================
echo   FIX: Jobs Not Showing
echo ============================================
echo.
echo This script will help fix the issue where
echo jobs are not showing in the dashboard.
echo.
echo ============================================
echo   Step 1: Testing Database
echo ============================================
cd server
node test-api.js
cd ..
echo.
echo ============================================
echo   Step 2: Clear Browser Storage
echo ============================================
echo.
echo IMPORTANT: You must clear your browser storage!
echo.
echo Follow these steps:
echo 1. Open http://localhost:3000 in your browser
echo 2. Press F12 to open Developer Tools
echo 3. Go to "Application" or "Storage" tab
echo 4. Find "Local Storage" -^> "http://localhost:3000"
echo 5. DELETE the "auth-storage" entry
echo 6. Refresh the page (F5)
echo 7. Log in again with your credentials
echo.
echo ============================================
echo   Step 3: Restart Servers
echo ============================================
echo.
echo After clearing browser storage, restart the app:
echo.
echo Run: START.bat
echo.
echo Then go to: http://localhost:3000
echo Register a new account or log in
echo.
echo ============================================
pause
