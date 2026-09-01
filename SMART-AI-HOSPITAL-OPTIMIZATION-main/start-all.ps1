# SmartCare AI Hospital Management System - All-in-one Launcher (PowerShell)
# Works no matter where the script is run from: it uses its own folder as the root.

$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   SmartCare AI Hospital Management Platform       " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Base paths on the script's own location (project root)
$rootPath = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($rootPath)) {
    $rootPath = (Get-Location).Path
}

$frontend1 = Join-Path $rootPath "smartcare"
$frontend2 = Join-Path $rootPath "HOSPITAL-OPTIMIZATION"
$backend   = Join-Path $rootPath "HOSPITAL-OPTIMIZATION\backend"

# Quick sanity checks so failures are obvious instead of silent
foreach ($p in @(@("Patient frontend", (Join-Path $frontend1 "package.json")),
                 @("Hospital frontend", (Join-Path $frontend2 "package.json")),
                 @("Backend POM", (Join-Path $backend "pom.xml")))) {
    if (-not (Test-Path -LiteralPath $p[1])) {
        Write-Host "  [ERROR] Could not find $($p[0]): $($p[1])" -ForegroundColor Red
        Write-Host "  Please keep this script in the project root folder." -ForegroundColor Red
        exit 1
    }
}

# 1. Start Backend on Port 8080
Write-Host "[1/3] Starting Spring Boot REST Backend on http://localhost:8080 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$backend'; mvn spring-boot:run"

Start-Sleep -Seconds 5

# 2. Start SmartCare Patient Frontend on Port 5173
Write-Host "[2/3] Starting SmartCare Patient Kiosk on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$frontend1'; npm run dev -- --port 5173"

# 3. Start Hospital Manager Frontend on Port 5174
Write-Host "[3/3] Starting Hospital Manager Portal on http://localhost:5174 ..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$frontend2'; npm run dev -- --port 5174"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " All services are launching in separate windows:" -ForegroundColor Cyan
Write-Host " - Patient Voice Kiosk:     http://localhost:5173" -ForegroundColor Green
Write-Host " - Hospital Staff Portal:   http://localhost:5174" -ForegroundColor Magenta
Write-Host " - Spring Boot REST API:    http://localhost:8080" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
