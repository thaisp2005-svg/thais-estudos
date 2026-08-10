@echo off
title Estudo+ - servidor local
cd /d "%~dp0"
start "Estudo+ (servidor)" cmd /k "npm run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:3000"
