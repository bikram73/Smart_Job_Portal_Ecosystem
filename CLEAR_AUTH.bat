@echo off
echo ============================================
echo   CLEAR AUTHENTICATION TOKEN
echo ============================================
echo.
echo Your authentication token is outdated.
echo.
echo Please follow these steps:
echo.
echo 1. Open your browser (where the app is running)
echo 2. Press F12 to open Developer Tools
echo 3. Go to the "Application" or "Storage" tab
echo 4. Find "Local Storage" in the left sidebar
echo 5. Click on "http://localhost:3000"
echo 6. Find and delete the "auth-storage" entry
echo 7. Refresh the page (F5)
echo 8. Log in again with your credentials
echo.
echo OR simply clear all browser data for localhost:3000
echo.
echo ============================================
pause
