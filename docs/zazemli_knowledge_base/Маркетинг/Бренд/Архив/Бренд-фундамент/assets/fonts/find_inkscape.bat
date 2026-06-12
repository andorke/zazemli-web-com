@echo off
chcp 65001 >nul
echo Searching for Inkscape on this system...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$ErrorActionPreference = 'SilentlyContinue';" ^
"$found = @();" ^
"# 1. PATH" ^
"$p = Get-Command inkscape.exe -ErrorAction SilentlyContinue; if ($p) { $found += $p.Source };" ^
"# 2. App Paths registry" ^
"$ap = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\inkscape.exe' -EA 0).'(default)'; if ($ap -and (Test-Path $ap)) { $found += $ap };" ^
"# 3. Uninstall registry (HKLM/HKLM 32-bit/HKCU)" ^
"$reg = @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*','HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*');" ^
"foreach ($r in $reg) { Get-ItemProperty $r -EA 0 ^| Where-Object { $_.DisplayName -like 'Inkscape*' } ^| ForEach-Object { if ($_.InstallLocation) { $candidates = @((Join-Path $_.InstallLocation 'bin\inkscape.exe'), (Join-Path $_.InstallLocation 'inkscape.exe')); foreach ($c in $candidates) { if (Test-Path $c) { $found += $c } } } } };" ^
"# 4. Common install locations" ^
"$paths = @('C:\Program Files\Inkscape\bin\inkscape.exe','C:\Program Files\Inkscape\inkscape.exe','C:\Program Files (x86)\Inkscape\bin\inkscape.exe','C:\Program Files (x86)\Inkscape\inkscape.exe',\"$env:LOCALAPPDATA\Programs\Inkscape\bin\inkscape.exe\",\"$env:LOCALAPPDATA\Programs\Inkscape\inkscape.exe\",\"$env:USERPROFILE\scoop\apps\inkscape\current\bin\inkscape.exe\");" ^
"foreach ($pp in $paths) { if (Test-Path $pp) { $found += $pp } };" ^
"# 5. Start Menu shortcuts (.lnk → resolve target)" ^
"$wsh = New-Object -ComObject WScript.Shell;" ^
"$startmenus = @(\"$env:APPDATA\Microsoft\Windows\Start Menu\",\"$env:ProgramData\Microsoft\Windows\Start Menu\");" ^
"foreach ($sm in $startmenus) { if (Test-Path $sm) { Get-ChildItem $sm -Recurse -Filter 'Inkscape*.lnk' -EA 0 ^| ForEach-Object { try { $t = $wsh.CreateShortcut($_.FullName).TargetPath; if ($t -and (Test-Path $t)) { $found += $t } } catch {} } } };" ^
"# 6. Brute force search (slow, last resort)" ^
"if ($found.Count -eq 0) { Write-Host 'Searching disk (slow)...'; $cands = Get-ChildItem -Path 'C:\','D:\','E:\' -Filter 'inkscape.exe' -Recurse -EA 0 ^| Select-Object -First 5; foreach ($c in $cands) { $found += $c.FullName } };" ^
"# Output unique" ^
"$unique = $found ^| Select-Object -Unique;" ^
"if ($unique.Count -eq 0) { Write-Host '[X] Inkscape NOT FOUND anywhere.' -ForegroundColor Red; exit 1 };" ^
"Write-Host '[OK] Found Inkscape at:' -ForegroundColor Green;" ^
"$unique ^| ForEach-Object { Write-Host ('   ' + $_) };" ^
"# Save first valid path to txt" ^
"$first = $unique ^| Select-Object -First 1;" ^
"Set-Content -Path \"$PSScriptRoot\inkscape_path.txt\" -Value $first -Encoding utf8;" ^
"Write-Host '';" ^
"Write-Host \"Path saved to inkscape_path.txt\" -ForegroundColor Cyan"

echo.
pause
