@echo off
title SmartCare AI Hospital Management System
setlocal enabledelayedexpansion

rem Base the script's location (works no matter where it is run from)
set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo ===================================================
echo   SmartCare AI Hospital Management System
echo   Project root: %ROOT%
echo ===================================================
echo.
if not exist "%ROOT%\HOSPITAL-OPTIMIZATION\package.json" (
    echo [ERROR] Cannot find the project under: %ROOT%
    echo         Please keep this file in the project root folder.
    pause
    exit /b 1
)
echo Starting all services...
echo.

rem 1. Start Spring Boot Backend (Port 8080)
echo [1/3] Starting Spring Boot Backend API on http://localhost:8080 ...
start "SmartCare Backend (Port 8080)" cmd /k "cd /d "%ROOT%\HOSPITAL-OPTIMIZATION\backend" && mvn spring-boot:run"

rem Wait 5 seconds for backend initialization
timeout /t 5 /nobreak >nul

rem 2. Start SmartCare Patient Voice Kiosk (Port 5173)
echo [2/3] Starting SmartCare Patient Kiosk on http://localhost:5173 ...
start "SmartCare Patient Kiosk (Port 5173)" cmd /k "cd /d "%ROOT%\smartcare" && npm run dev -- --port 5173"

rem 3. Start Hospital Manager Portal (Port 5174)
echo [3/3] Starting Hospital Manager Portal on http://localhost:5174 ...
start "Smart Hospital Manager (Port 5174)" cmd /k "cd /d "%ROOT%\HOSPITAL-OPTIMIZATION" && npm run dev -- --port 5174"

echo.
echo ===================================================
echo   All 3 services are starting up:
echo   - Patient Portal:  http://localhost:5173
echo   - Hospital Portal: http://localhost:5174
echo   - Backend API:     http://localhost:8080
echo ===================================================
echo.
pause
