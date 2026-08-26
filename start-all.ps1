# SmartCare AI Hospital Management System - All-in-one Launcher (PowerShell)

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   SmartCare AI Hospital Management Platform       " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

# 1. Start Backend on Port 8080
Write-Host "[1/3] Starting Spring Boot REST Backend on http://localhost:8080 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath\HOSPITAL-OPTIMIZATION\backend'; mvn spring-boot:run"

Start-Sleep -Seconds 5

# 2. Start SmartCare Patient Frontend on Port 5173
Write-Host "[2/3] Starting SmartCare Patient Kiosk on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath\smartcare'; npm run dev -- --port 5173"

# 3. Start Hospital Manager Frontend on Port 5174
Write-Host "[3/3] Starting Hospital Manager Portal on http://localhost:5174 ..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath\HOSPITAL-OPTIMIZATION'; npm run dev -- --port 5174"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " All services are launching in separate windows:" -ForegroundColor Cyan
Write-Host " - Patient Voice Kiosk:     http://localhost:5173" -ForegroundColor Green
Write-Host " - Hospital Staff Portal:   http://localhost:5174" -ForegroundColor Magenta
Write-Host " - Spring Boot REST API:    http://localhost:8080" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
