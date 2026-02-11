@echo off
echo ============================================
echo   RESEED JOB DATABASE
echo ============================================
echo.
echo This will delete all existing jobs and reseed with fresh data.
echo.
pause
echo.
echo Reseeding database...
cd server
node reseed-force.js
cd ..
echo.
echo ============================================
echo   DONE!
echo ============================================
pause
