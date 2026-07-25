@echo off
chcp 65001 >nul
title 局域网离线供应商培训平台

echo ========================================
echo  局域网离线供应商培训平台 - 启动程序
echo ========================================
echo.

if not exist "%~dp0node_modules" (
    echo 正在安装项目依赖...
    echo 首次运行需要下载依赖，请耐心等待
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        echo 请检查是否已安装 Node.js（版本18+）
        echo 下载地址: https://nodejs.org/
        pause
        exit /b 1
    )
)

echo 正在构建项目...
echo.
npm run build
if errorlevel 1 (
    echo.
    echo ❌ 项目构建失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo  项目构建完成，正在启动服务器...
echo ========================================
echo.
echo 启动后请在同一局域网内的设备浏览器中访问显示的地址
echo.

npm run server

pause
