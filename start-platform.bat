@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo    供应商培训平台 - 启动脚本
echo ========================================
echo.

echo 正在检查 Python 是否已安装...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到 Python，请先安装 Python
    echo.
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

echo 正在检查服务是否已启动...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do (
    if not "%%a"=="" (
        echo 错误：端口 3000 已被占用（PID: %%a）
        echo.
        echo 请先停止占用端口的程序，或运行 stop-platform.bat
        pause
        exit /b 1
    )
)

cd /d "%~dp0flask-backend"

echo 正在安装依赖...
pip install Flask Flask-SQLAlchemy Flask-JWT-Extended flask-cors bcrypt >nul 2>&1

echo 正在启动平台服务...
start /b python app.py

echo 等待服务启动...
timeout /t 3 /nobreak >nul

echo 服务已启动！
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set "ip=%%b"
        if not "!ip!"=="" (
            echo    http://!ip!:3000
        )
    )
)

echo    http://localhost:3000 (本机访问)
echo.
echo ========================================
echo    使用说明
echo ========================================
echo.
echo 1. 在同一局域网内的其他设备上，打开浏览器访问上面的地址
echo 2. 关闭此窗口后，服务会继续在后台运行
echo 3. 如需停止服务，请双击运行 stop-platform.bat
echo 4. 如需开机自动启动，请将此脚本的快捷方式放入：
echo    C:\Users\用户名\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
echo    或者按下 Win + R，输入 shell:startup 打开启动文件夹
echo.
echo ========================================
echo.
pause
