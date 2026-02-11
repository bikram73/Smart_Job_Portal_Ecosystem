@echo off
cls
echo ========================================
echo  FIXING AND STARTING JOB PORTAL
echo ========================================
echo.

echo Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo Step 3: Starting application...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Wait for both servers to start...
echo Press Ctrl+C to stop
echo.

npm run dev
