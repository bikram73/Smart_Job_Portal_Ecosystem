@echo off
echo ========================================
echo  Smart Job Portal - Starting Application
echo ========================================
echo.
echo Killing any existing processes on ports 3000 and 5000...
echo.

REM Kill processes on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a on port 5000
    taskkill /F /PID %%a 2>nul
)

REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Killing process %%a on port 3000
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo Starting servers...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

npm run dev
