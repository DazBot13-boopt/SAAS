@echo off
echo ====================================
echo   TWITTER BOT - QUICK START
echo ====================================
echo.

echo [1/4] Checking Redis...
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Redis is not running!
    echo Please start Redis first: redis-server
    pause
    exit /b 1
)
echo ✅ Redis is running

echo.
echo [2/4] Checking Backend...
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is not running!
    echo Please start the backend: cd d:\SAAS\backend ^&^& npm run dev
    pause
    exit /b 1
)
echo ✅ Backend is running

echo.
echo [3/4] Checking Twitter Account...
node check_accounts.js
echo.

echo [4/4] Starting Worker...
echo Press Ctrl+C to stop
echo.
npm run dev
