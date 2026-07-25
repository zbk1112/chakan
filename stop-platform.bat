@echo off
chcp 65001 >nul
echo ========================================
echo    供应商培训平台 - 停止脚本
echo ========================================
echo.

echo 正在停止平台服务...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do (
    taskkill /f /pid %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo 服务进程 (PID: %%a) 已停止
    )
)

echo.
echo ========================================
echo    服务已停止
echo ========================================
echo.
pause
