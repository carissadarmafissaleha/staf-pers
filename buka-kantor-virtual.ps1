<#
.SYNOPSIS
    Menjalankan dan Membuka Kantor Virtual Administratif Staf Pers Yonif 735/Nawasena.
.DESCRIPTION
    Menjalankan backend server dan meluncurkan antarmuka visual kantor virtual
    di browser default lengkap dengan token otentikasi.
#>

$ErrorActionPreference = "Stop"

$virtualDir = Join-Path $PSScriptRoot "kantor-virtual"
if (-not (Test-Path $virtualDir)) {
    Write-Error "Folder kantor-virtual tidak ditemukan!"
    exit 1
}

# Cek apakah server sudah berjalan di port 3334
$serverRunning = $false
try {
    $test = Invoke-WebRequest -Uri "http://127.0.0.1:3334/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($test.StatusCode -eq 200) { $serverRunning = $true }
} catch {}

if (-not $serverRunning) {
    Write-Host "[1/2] Menyalakan Server Kantor Virtual Staf Pers..." -ForegroundColor Cyan
    Start-Process -FilePath "node" -ArgumentList "server/index.js" -WorkingDirectory $virtualDir -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/2] Server Kantor Virtual sudah aktif di port 3334." -ForegroundColor Green
}

# Ambil token otentikasi
$tokenFile = Join-Path $env:USERPROFILE ".agent-office\auth-token"
$token = ""
if (Test-Path $tokenFile) {
    $token = (Get-Content $tokenFile -Raw).Trim()
}

$url = "http://127.0.0.1:3334/"
if ($token) {
    $url += "#token=$token"
}

Write-Host "[2/2] Membuka Antarmuka Kantor Virtual di Browser..." -ForegroundColor Cyan
Start-Process $url

Write-Host "`nBERHASIL! Kantor Virtual Staf Personalia aktif di:" -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Yellow
