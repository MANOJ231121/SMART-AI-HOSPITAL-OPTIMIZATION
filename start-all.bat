@echo off
title SmartCare AI Hospital Management System
echo ===================================================
echo   SmartCare AI Hospital Management System
echo ===================================================
echo.
echo Starting all services...
echo.

:: 1. Start Spring Boot Backend (Port 8080)
echo [1/3] Starting Spring Boot Backend API on http://localhost:8080 ...
start "SmartCare Backend (Port 8080)" cmd /k "cd HOSPITAL-OPTIMIZATION\backend && mvn spring-boot:run"

:: Wait 5 seconds for backend initialization
timeout /t 5 /nobreak >nul

:: 2. Start SmartCare Patient Voice Kiosk (Port 5173)
echo [2/3] Starting SmartCare Patient Kiosk on http://localhost:5173 ...
start "SmartCare Patient Kiosk (Port 5173)" cmd /k "cd smartcare && npm run dev -- --port 5173"

:: 3. Start Hospital Manager Portal (Port 5174)
echo [3/3] Starting Hospital Manager Portal on http://localhost:5174 ...
start "Smart Hospital Manager (Port 5174)" cmd /k "cd HOSPITAL-OPTIMIZATION && npm run dev -- --port 5174"

echo.
echo ===================================================
echo   All 3 services are starting up:
echo   - Patient Portal:  http://localhost:5173
echo   - Hospital Portal: http://localhost:5174
echo   - Backend API:     http://localhost:8080
echo ===================================================
echo.
pause
