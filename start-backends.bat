@echo off
echo ========================================
echo  Starting AS400 Backend Servers
echo ========================================
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo [ERROR] backend\.env not found!
    echo Please copy backend\.env.example to backend\.env and configure it.
    pause
    exit /b 1
)

if not exist "ai-backend\.env" (
    echo [ERROR] ai-backend\.env not found!
    echo Please copy ai-backend\.env.example to ai-backend\.env and configure it.
    pause
    exit /b 1
)

echo [1/2] Starting Backend API (Port 4000)...
start "AS400 Backend API" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak > nul

echo [2/2] Starting Backend IA (Port 3001)...
start "AS400 Backend IA" cmd /k "cd ai-backend && npm run dev"

echo.
echo ========================================
echo  Backends Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:4000
echo Backend IA:   http://localhost:3001
echo.
echo Press any key to exit this window...
pause > nul
