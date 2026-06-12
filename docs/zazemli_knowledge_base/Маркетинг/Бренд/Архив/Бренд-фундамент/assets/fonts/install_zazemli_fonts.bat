@echo off
REM Шрифты zazemli-brand — финальная регистрация для текущего пользователя.
REM Файлы уже скопированы в %LOCALAPPDATA%\Microsoft\Windows\Fonts.
REM Этот скрипт добавляет их в HKCU реестр и оповещает приложения.

echo === Регистрация шрифтов zazemli-brand ===
echo.
reg import "%~dp0register_zazemli_fonts.reg"
if errorlevel 1 (
    echo.
    echo [!] Не удалось импортировать. Можно открыть register_zazemli_fonts.reg
    echo     двойным кликом и подтвердить вручную.
    pause
    exit /b 1
)

echo.
echo === Готово. Перезапустите Inkscape/Word, чтобы увидеть шрифты. ===
echo.

REM Уведомить приложения через WM_FONTCHANGE (best-effort через PowerShell)
powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class N { [DllImport(\"user32.dll\")] public static extern int SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam); }'; [N]::SendMessage([IntPtr]0xFFFF, 0x001D, [IntPtr]::Zero, [IntPtr]::Zero) | Out-Null" 2>nul

pause
