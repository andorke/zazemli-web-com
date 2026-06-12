@echo off
chcp 65001 >nul

echo Closing Inkscape...
taskkill /IM inkscape.exe /F >nul 2>&1
taskkill /IM inkscape.com /F >nul 2>&1
timeout /t 1 /nobreak >nul

echo Locating Inkscape...

REM 1) Try PowerShell: PATH, App Paths, Uninstall registry
set INKPATH=
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$ErrorActionPreference='SilentlyContinue'; $p = Get-Command inkscape.exe; if ($p) { $p.Source; exit }; $r = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\inkscape.exe'; if ($r) { $r.'(default)'; exit }; $u = @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*','HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*') ^| ForEach-Object { Get-ItemProperty $_ } ^| Where-Object { $_.DisplayName -like 'Inkscape*' } ^| Select-Object -First 1; if ($u -and $u.InstallLocation) { (Join-Path $u.InstallLocation 'bin\inkscape.exe'), (Join-Path $u.InstallLocation 'inkscape.exe') ^| Where-Object { Test-Path $_ } ^| Select-Object -First 1 }"`) do set INKPATH=%%I

if defined INKPATH (
    if exist "%INKPATH%" (
        echo Found: %INKPATH%
        start "" "%INKPATH%"
        echo Done.
        timeout /t 2 /nobreak >nul
        exit /b 0
    )
)

REM 2) Standard install paths
for %%P in (
    "C:\Program Files\Inkscape\bin\inkscape.exe"
    "C:\Program Files\Inkscape\inkscape.exe"
    "C:\Program Files (x86)\Inkscape\bin\inkscape.exe"
    "C:\Program Files (x86)\Inkscape\inkscape.exe"
    "%LOCALAPPDATA%\Programs\Inkscape\bin\inkscape.exe"
    "%LOCALAPPDATA%\Programs\Inkscape\inkscape.exe"
    "%ProgramW6432%\Inkscape\bin\inkscape.exe"
) do (
    if exist %%P (
        echo Found: %%P
        start "" %%P
        echo Done.
        timeout /t 2 /nobreak >nul
        exit /b 0
    )
)

echo.
echo [X] Inkscape not found.
echo     - Install from https://inkscape.org/release/
echo     - Or open it manually from Start menu after install.
echo.
pause
exit /b 1
