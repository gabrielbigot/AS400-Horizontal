@echo off
title AS400 Comptabilité Horizontale - TAC Hockey
color 0A

echo ================================================
echo    AS400 COMPTABILITE HORIZONTALE
echo    TAC Hockey Club
echo ================================================
echo.
echo Demarrage de l'application complete...
echo.

cd /d "%~dp0"

REM ============================================
REM  VERIFICATION NODE.JS
REM ============================================
echo [1/5] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js detecte
echo.

REM ============================================
REM  VERIFICATION FICHIERS .ENV
REM ============================================
echo [2/5] Verification de la configuration...

if not exist "backend\.env" (
    echo [ATTENTION] backend\.env manquant
    echo Copie de backend\.env.example vers backend\.env
    copy "backend\.env.example" "backend\.env" >nul
    echo IMPORTANT: Editez backend\.env avec vos cles API Supabase
    echo.
)

if not exist "ai-backend\.env" (
    echo [ATTENTION] ai-backend\.env manquant
    echo Copie de ai-backend\.env.example vers ai-backend\.env
    copy "ai-backend\.env.example" "ai-backend\.env" >nul
    echo IMPORTANT: Editez ai-backend\.env avec vos cles API
    echo.
)
echo ✓ Fichiers de configuration OK
echo.

REM ============================================
REM  INSTALLATION DEPENDANCES FRONTEND
REM ============================================
echo [3/5] Verification des dependances frontend...
if not exist "node_modules\" (
    echo Installation des dependances frontend...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERREUR lors de l'installation des dependances frontend
        pause
        exit /b 1
    )
)
echo ✓ Dependances frontend OK
echo.

REM ============================================
REM  INSTALLATION DEPENDANCES BACKENDS
REM ============================================
echo [4/5] Verification des dependances backends...

if not exist "backend\node_modules\" (
    echo Installation des dependances Backend API...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ERREUR lors de l'installation du Backend API
        cd ..
        pause
        exit /b 1
    )
    cd ..
)
echo ✓ Backend API - Dependances OK

if not exist "ai-backend\node_modules\" (
    echo Installation des dependances Backend IA...
    cd ai-backend
    call npm install
    if errorlevel 1 (
        echo ERREUR lors de l'installation du Backend IA
        cd ..
        pause
        exit /b 1
    )
    cd ..
)
echo ✓ Backend IA - Dependances OK
echo.

REM ============================================
REM  DEMARRAGE DES SERVEURS
REM ============================================
echo [5/5] Demarrage des serveurs...
echo.
echo ================================================
echo    DEMARRAGE EN COURS...
echo ================================================
echo.
echo Frontend Next.js:  http://localhost:3000
echo Backend API:       http://localhost:4000
echo Backend IA:        http://localhost:5000
echo.
echo Pour arreter les serveurs: Fermez les fenetres
echo ================================================
echo.

timeout /t 2 /nobreak >nul

REM Démarrer Backend API (Port 4000)
echo Demarrage Backend API (Port 4000)...
start "AS400 Backend API" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 2 /nobreak >nul

REM Démarrer Backend IA (Port 5000)
echo Demarrage Backend IA (Port 5000)...
start "AS400 Backend IA" cmd /k "cd /d "%~dp0ai-backend" && npm run dev"
timeout /t 2 /nobreak >nul

REM Démarrer Frontend Next.js (Port 3000)
echo Demarrage Frontend Next.js (Port 3000)...
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Lancer le frontend dans cette fenêtre
npm run dev

if errorlevel 1 (
    echo.
    echo ERREUR lors du demarrage
    pause
)

pause
