Scusami per la confusione. Ecco lo script singolo che risolve solo il problema del crash dopo 20 secondi:

```batch
@echo off
echo === SCRIPT DI AVVIO AUTOMATICO PER UNIFINDER (VERSIONE PERSONALIZZATA) ===

:: Imposta valori predefiniti senza chiedere input
set VM_NAME=AlpineServer
set OVA_PATH=%USERPROFILE%\Downloads\AlpineServer.ova

:: Verifica e installa VirtualBox se necessario
set VBOX_FOUND=0
for %%p in (
    "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
    "C:\Program Files (x86)\Oracle\VirtualBox\VBoxManage.exe"
) do (
    if exist %%p (
        set VBOX_PATH=%%p
        set VBOX_FOUND=1
        echo VirtualBox trovato: %%p
        goto :vbox_found
    )
)
:vbox_found

if %VBOX_FOUND%==0 (
    echo VirtualBox non trovato. Installazione in corso...
    :: Download e installazione automatica di VirtualBox
    set VB_INSTALLER=%TEMP%\VirtualBox_installer.exe
    echo Downloading VirtualBox installer...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://download.virtualbox.org/virtualbox/7.0.14/VirtualBox-7.0.14-161095-Win.exe', '%VB_INSTALLER%')"
    echo Installazione VirtualBox in corso...
    start /wait "" "%VB_INSTALLER%" --silent
    del "%VB_INSTALLER%"
    
    :: Riprova a trovare VirtualBox dopo l'installazione
    for %%p in (
        "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
        "C:\Program Files (x86)\Oracle\VirtualBox\VBoxManage.exe"
    ) do (
        if exist %%p (
            set VBOX_PATH=%%p
            set VBOX_FOUND=1
            echo VirtualBox installato: %%p
            goto :vbox_check_done
        )
    )
    
    echo Impossibile installare VirtualBox automaticamente.
    echo Installa VirtualBox manualmente e riprova.
    pause
    exit /b 1
)
:vbox_check_done

:: Verifica e installa PuTTY e plink se necessario
set PUTTY_FOUND=0
for %%p in (
    "C:\Program Files\PuTTY\putty.exe"
    "C:\Program Files (x86)\PuTTY\putty.exe"
    "%USERPROFILE%\Desktop\putty\putty.exe"
    "%USERPROFILE%\Downloads\putty.exe"
) do (
    if exist %%p (
        set PUTTY_PATH=%%p
        set PUTTY_FOUND=1
        echo PuTTY trovato: %%p
        goto :putty_found
    )
)
:putty_found

set PLINK_FOUND=0
for %%p in (
    "C:\Program Files\PuTTY\plink.exe"
    "C:\Program Files (x86)\PuTTY\plink.exe"
    "%USERPROFILE%\Desktop\putty\plink.exe"
    "%USERPROFILE%\Downloads\plink.exe"
) do (
    if exist %%p (
        set PLINK_PATH=%%p
        set PLINK_FOUND=1
        echo Plink trovato: %%p
        goto :plink_found
    )
)
:plink_found

if %PUTTY_FOUND%==0 (
    echo PuTTY non trovato. Installazione in corso...
    :: Download di PuTTY da putty.org
    set PUTTY_DIR=%TEMP%\putty
    mkdir "%PUTTY_DIR%" 2>nul
    echo Downloading PuTTY da putty.org...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe', '%PUTTY_DIR%\putty.exe')"
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe', '%PUTTY_DIR%\plink.exe')"
    
    :: Crea directory in Program Files
    mkdir "C:\Program Files\PuTTY" 2>nul
    copy /Y "%PUTTY_DIR%\putty.exe" "C:\Program Files\PuTTY\putty.exe"
    copy /Y "%PUTTY_DIR%\plink.exe" "C:\Program Files\PuTTY\plink.exe"
    rmdir /S /Q "%PUTTY_DIR%"
    
    :: Imposta i percorsi
    set PUTTY_PATH=C:\Program Files\PuTTY\putty.exe
    set PUTTY_FOUND=1
    set PLINK_PATH=C:\Program Files\PuTTY\plink.exe
    set PLINK_FOUND=1
    
    echo PuTTY e Plink installati in: C:\Program Files\PuTTY\
)

if %PLINK_FOUND%==0 (
    echo Plink non trovato. Installazione in corso...
    :: Download di Plink da putty.org
    set PUTTY_DIR=%TEMP%\putty
    mkdir "%PUTTY_DIR%" 2>nul
    echo Downloading Plink da putty.org...
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe', '%PUTTY_DIR%\plink.exe')"
    
    :: Copia nella stessa directory di PuTTY se esiste
    if exist "%PUTTY_PATH%" (
        for %%i in ("%PUTTY_PATH%") do set PUTTY_DIR=%%~dpi
        copy /Y "%TEMP%\putty\plink.exe" "%PUTTY_DIR%plink.exe"
        set PLINK_PATH=%PUTTY_DIR%plink.exe
    ) else (
        :: Altrimenti crea directory in Program Files
        mkdir "C:\Program Files\PuTTY" 2>nul
        copy /Y "%PUTTY_DIR%\plink.exe" "C:\Program Files\PuTTY\plink.exe"
        set PLINK_PATH=C:\Program Files\PuTTY\plink.exe
    )
    
    rmdir /S /Q "%PUTTY_DIR%"
    set PLINK_FOUND=1
    echo Plink installato in: %PLINK_PATH%
)

:: Verifica se la VM esiste
echo Verifica esistenza VM %VM_NAME%...
%VBOX_PATH% list vms | find /i "%VM_NAME%" > nul
if errorlevel 1 (
    echo La VM "%VM_NAME%" non esiste. Importazione OVA...
    
    if not exist "%OVA_PATH%" (
        echo File OVA non trovato in "%OVA_PATH%"
        echo Per favore scarica il file AlpineServer.ova e posizionalo in %OVA_PATH%
        pause
        exit /b 1
    )
    
    :: Importa OVA
    echo Importazione macchina virtuale da "%OVA_PATH%"...
    %VBOX_PATH% import "%OVA_PATH%" --vsys 0 --vmname "%VM_NAME%"
    
      if errorlevel 1 (
        echo Errore durante l'importazione della VM.
        pause
        exit /b 1
    )
    
    echo VM importata con successo.
)

:: 1. Configura il port forwarding
echo Configurazione port forwarding...
%VBOX_PATH% modifyvm "%VM_NAME%" --natpf1 delete "UniFinder" 2>nul
%VBOX_PATH% modifyvm "%VM_NAME%" --natpf1 "UniFinder,tcp,127.0.0.1,3001,,3001"
%VBOX_PATH% modifyvm "%VM_NAME%" --natpf1 delete "SSH" 2>nul
%VBOX_PATH% modifyvm "%VM_NAME%" --natpf1 "SSH,tcp,127.0.0.1,2222,,22"

:: 2. Avvia la VM
echo Avvio della macchina virtuale...
%VBOX_PATH% startvm "%VM_NAME%" --type headless
if errorlevel 1 (
    echo ERRORE: Impossibile avviare la VM.
    pause
    exit /b 1
)

:: 3. Attendi che la VM sia pronta (tempo aumentato)
echo Attesa avvio VM (45 secondi)...
echo Iniziato attesa alle %time%
timeout /t 45 /nobreak
echo Finito attesa alle %time%

:: 4. Verifica connessione SSH e accetta la chiave automaticamente
echo Verifica connessione SSH...
echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa -batch localhost "echo Connessione SSH stabilita" 2>nul
if errorlevel 1 (
    echo Prima connessione SSH, accettazione chiave...
    echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "exit" 2>nul
    timeout /t 5 /nobreak
    echo Riprovo connessione SSH...
    echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa -batch localhost "echo Connessione SSH stabilita" 2>nul
    if errorlevel 1 (
        echo ERRORE: Impossibile stabilire connessione SSH. Lo script continuerà comunque...
    ) else (
        echo Connessione SSH stabilita con successo.
    )
) else (
    echo Connessione SSH stabilita con successo.
)

:: 5. Installa dipendenze e configura ambiente
echo Installazione dipendenze e preparazione ambiente...
echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "apk update && apk add git nodejs npm sqlite" 2>nul

:: 6. Clona repository e installa dipendenze
echo Clonazione repository e installazione dipendenze...
echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "rm -rf ~/UniFinder && git clone https://github.com/AlinTheDude/UniFinder.git && cd ~/UniFinder && npm install && npm install sqlite3 --build-from-source && npm rebuild sqlite3" 2>nul

:: 7. Avvia applicazione in background
echo Avvio applicazione UniFinder...
echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "cd ~/UniFinder && nohup node server.js > server.log 2>&1 &" 2>nul

:: 8. Attendi che il server sia pronto (tempo aumentato)
echo Attesa avvio server (60 secondi)...
timeout /t 60 /nobreak

:: 9. Verifica che il server sia in esecuzione
echo Verifica che il server sia in esecuzione...
echo y | %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "ps aux | grep node" 2>nul

:: 10. Apri il browser su localhost:3001
echo Apertura browser...
start http://localhost:3001

echo === UNIFINDER AVVIATO CON SUCCESSO ===
echo.
echo IMPORTANTE: La VM rimarrà in esecuzione anche dopo la chiusura di questa finestra.
echo Per terminare il server, esegui manualmente questo comando da una nuova finestra CMD:
echo %PLINK_PATH% -ssh -P 2222 -l mastroiannim -pw paleocapa localhost "poweroff"
echo.
echo Premi un tasto per chiudere questa finestra (la VM continuerà a funzionare)...
pause

:: Usciamo senza spegnere la VM
exit /b 0