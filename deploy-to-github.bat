@echo off
chcp 65001 >nul
echo ========================================
echo   部署到 GitHub Pages (公网访问)
echo ========================================
echo.
echo 注意: 部署成功后，即使电脑关机，网站仍可通过公网访问
echo.
set /p GITHUB_TOKEN=请输入您的 GitHub Personal Access Token: 
echo.
echo 正在部署...
echo.
set "GITHUB_TOKEN=%GITHUB_TOKEN%"
node scripts/deploy-to-github.cjs
echo.
pause