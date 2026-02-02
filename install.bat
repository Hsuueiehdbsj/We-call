@echo off
REM WeCall Installation Script for Windows
REM This script will set up both backend and frontend

echo ==========================================
echo    WeCall Installation Script
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Python 3 is not installed. Please install Python 3.8+ first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo [OK] Python found
echo [OK] Node.js found
echo.

REM Backend Setup
echo ==========================================
echo Setting up Backend...
echo ==========================================
cd backend

echo [*] Creating virtual environment...
python -m venv venv

echo [*] Activating virtual environment...
call venv\Scripts\activate.bat

echo [*] Installing Python dependencies...
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo [*] Creating .env file...
if exist .env.example copy .env.example .env >nul 2>&1

echo [OK] Backend setup complete!
echo.

REM Frontend Setup
echo ==========================================
echo Setting up Frontend...
echo ==========================================
cd ..\frontend

echo [*] Installing Node dependencies...
call npm install

echo [*] Creating .env file...
if exist .env.example copy .env.example .env >nul 2>&1

echo [OK] Frontend setup complete!
echo.

REM Summary
echo ==========================================
echo    Installation Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    venv\Scripts\activate
echo    python run.py
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo For more information, see README.md
echo ==========================================
pause
