@echo off
title Abrindo Chrome com Automacao Hotmart
echo ========================================================
echo Fechando processos antigos do Chrome...
echo ========================================================
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo ========================================================
echo Iniciando Google Chrome com Modo de Automacao...
echo ========================================================
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 "https://app.hotmart.com/login"

echo.
echo Pronto! O Chrome foi aberto na tela de login da Hotmart.
echo Faca seu login normalmente. Quando terminar, volte no chat
echo e digite: "Pronto, loguei!"
timeout /t 5 >nul

