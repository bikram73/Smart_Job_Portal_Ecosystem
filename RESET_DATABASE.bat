@echo off
color 0C
echo ============================================
echo   RESET DATABASE
echo ============================================
echo.
echo This will completely reset the database:
echo - Delete all users
echo - Delete all applications  
echo - Recreate fresh database
echo - Seed with sample jobs
echo.
echo ============================================
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%" NEQ "y" (
    echo Cancelled.
    pause
    exit /b
)

echo.
echo Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1

echo Resetting database...
cd server
node reset-db.js
cd ..

echo.
echo ============================================
echo   DATABASE RESET COMPLETE!
echo ============================================
echo.
echo You can now start the server with:
echo   START.bat
echo.
pause