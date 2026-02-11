@echo off
echo Stopping all servers...
echo.

taskkill /F /IM node.exe 2>nul

echo.
echo All Node.js processes stopped!
echo You can now restart with FIX_AND_START.bat
echo.
pause
