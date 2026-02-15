@echo off
color 0B
echo ============================================
echo           VIEW USER DATABASE
echo ============================================
echo.
cd server
node view-users.js
cd ..
echo.
pause
