@echo off
title AS400 Application Launcher
color 0A

echo ========================================
echo   AS400 Application Launcher
echo ========================================
echo.

echo [1/2] Starting Backend Server...
echo.
start "AS400 Backend" cmd /k "cd /d "%~dp0ai-backend" && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Frontend Server...
echo.
start "AS400 Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ========================================
echo   Application Starting!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Two command windows will open.
echo Close this window when done.
echo.
pause
