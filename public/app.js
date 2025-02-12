document.addEventListener('DOMContentLoaded', function() {
    // Funzione per attendere l'esistenza di un elemento nel DOM
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    


    // Gestione della registrazione
    waitForElement('#registrationForm', () => {
        const registrationForm = document.getElementById('registrationForm');
        
        if (registrationForm) {
            registrationForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const password = document.getElementById('regPassword').value.trim();
                const preferenze = document.getElementById('regPreferenze').value.trim();

                console.log("Dati del form di registrazione:", {
                    nome: name,
                    email: email,
                    password: password,
                    preferenze: preferenze
                });

                fetch('http://65.108.146.104:3001/registrazione', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
                })
                .then(response => {
                    console.log('Status della risposta:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Risposta dal server:", data);
                
                    if (data.message === 'Registrazione completata') {
                        alert('Registrazione effettuata con successo!');
                        registrationForm.reset();
                    } else {
                        alert(data.error || 'Errore durante la registrazione');
                    }
                })
                .catch(error => {
                    console.error('Errore durante la registrazione:', error);
                    alert('Errore durante la registrazione. Riprova più tardi.');
                });
            });
        } else {
            console.warn("Elemento #registrationForm non trovato");
        }
    });

    // Gestione del login
    waitForElement('#loginForm', () => {
        const loginForm = document.getElementById('loginForm');
    
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
    
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value.trim();
    
                console.log("Dati del form di login:", { email, password });
    
                fetch('http://65.108.146.104:3001/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Risposta dal server:", data);
    
                        if (data.message === 'Login riuscito') {
                            // Salva email e nome nella sessione
                            sessionStorage.setItem('userEmail', email);
                            sessionStorage.setItem('userName', data.nome || 'Utente'); // Aggiungi il nome utente se disponibile
                            alert('Login effettuato con successo!');
                            window.location.href = 'dashboard.html'; // Reindirizza alla pagina della dashboard
                        } else {
                            alert(data.message || 'Errore durante il login');
                        }
                    })
                    .catch(error => {
                        console.error('Errore:', error);
                        alert('Errore di rete. Riprova più tardi.');
                    });
            });
        } else {
            console.warn("Elemento #loginForm non trovato");
        }
    });

    waitForElement('#searchForm', () => {
        const searchForm = document.getElementById('searchForm');

        if (searchForm) {
            searchForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const paese = document.getElementById('paese').value.trim();
                const tasseMassime = document.getElementById('tasseMassime').value.trim();
                const borseDiStudio = document.getElementById('borseDiStudio').value.trim();
                const offertaFormativa = document.getElementById('offertaFormativa').value.trim();
                const reputazioneMinima = document.getElementById('reputazioneMinima').value.trim();

                console.log("Dati per la ricerca università:", {
                    paese: paese,
                    tasseMassime: tasseMassime,
                    borseDiStudio: borseDiStudio,
                    offertaFormativa: offertaFormativa,
                    reputazioneMinima: reputazioneMinima
                });

                // Fai una richiesta POST al server
                fetch('http://65.108.146.104:3001/ricerca-universita', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paese: paese,
                        tasseMassime: tasseMassime,
                        borse_di_studio: borseDiStudio,
                        offerta_formativa: offertaFormativa,
                        reputazioneMinima: reputazioneMinima
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Risposta dal server per la ricerca:", data);

                    // Se ci sono università nel risultato, visualizzale
                    if (data.universita && data.universita.length > 0) {
                        let resultHTML = '<ul>';
                        data.universita.forEach(universita => {
                            resultHTML += `<li>${universita.nome}, ${universita.paese} - Reputazione: ${universita.reputazione}</li>`;
                        });
                        resultHTML += '</ul>';
                        document.getElementById('result').innerHTML = resultHTML;
                    } else {
                        document.getElementById('result').innerHTML = 'Nessuna università trovata con i criteri specificati.';
                    }
                })
                .catch(error => {
                    console.error('Errore durante la ricerca:', error);
                    alert('Errore durante la ricerca. Riprova più tardi.');
                });
            });
        } else {
            console.warn("Elemento #searchForm non trovato");
        }
    });

    // Funzione per gestire gli eventi predefiniti dei form
    function handleDefaultFormEvents() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                console.log(`Form ${form.id} inviato`);
                event.preventDefault();
                
                // Qui puoi aggiungere il tuo codice personalizzato per gestire il submit del form
            });
        });
    }

    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Funzione per inviare messaggio
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return; // Non inviare messaggi vuoti

        // Aggiunge il messaggio utente alla chat
        appendMessage(message, 'user-message');

        // Pulisce il campo di input
        chatInput.value = '';

        // Simulazione di una risposta del "bot" o dell'assistenza
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            appendMessage(botResponse, 'bot-message');
        }, 1000); // Ritardo di 1 secondo
    }

    // Funzione per aggiungere un messaggio alla chat
    function appendMessage(message, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', className);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scorrimento automatico in basso
    }

    // Simulazione di risposte automatiche
    function generateBotResponse(userMessage) {
        const responses = {
            'ciao': 'Ciao! Come posso aiutarti oggi?',
            'help': 'Ecco alcuni suggerimenti su come usare UniFinder...',
            'problema': 'Mi dispiace sapere che hai un problema. Puoi spiegarmi di più?',
            'grazie': 'Prego! Se hai bisogno di altro, fammelo sapere.',
        };

        for (let keyword in responses) {
            if (userMessage.toLowerCase().includes(keyword)) {
                return responses[keyword];
            }
        }

        return 'Non sono sicuro di aver capito. Puoi riformulare?';
    }

    function initGoogleLogin() {
        const googleButton = document.getElementById('google-login-button');
        if (!googleButton) return;
    
        // Inserisci qui il client ID ottenuto da Google Cloud Console
        const clientId = '630061902452-lrubn0joaj9pt5hhrq2e2k7nvfqsgep4.apps.googleusercontent.com';
        const scope = 'openid email profile';
    
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLoginCallback
        });
    
        google.accounts.id.renderButton(googleButton, {
            theme: 'outline',
            size: 'large'
        });
    }
    


    // Gestione del callback di login di Google
    
function handleGoogleLogin() {
    const googleButton = document.getElementById('google-login-button');
    if (!googleButton) return;

    // Inserisci qui il client ID ottenuto da Google Cloud Console
    const clientId = config.google.clientId;
    const scope = 'openid email profile';

    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLoginCallback
    });

    google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large'
    });
}

// Chiamata per inizializzare il pulsante di login di Google quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', handleGoogleLogin);

const googleButton = document.getElementById('google-login-button');
    if (!googleButton) {
        console.error("Pulsante di login Google non trovato");
        return;
    }

    // Inizializzazione del pulsante di login Google
    const clientId = config.google.clientId;
    const scope = 'openid email profile';

    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLoginCallback
    });

    google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large'
    });

    // Aggiungiamo un event listener per il click sul pulsante
    googleButton.addEventListener('click', function() {
        console.log("Pulsante di login Google cliccato");
        handleGoogleLoginCallback();
    });

    // Funzione per gestire il callback di Google
    function handleGoogleLoginCallback(response) {
        console.log('Risposta di Google:', response);
        const { credential } = response;

        fetch('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ credential }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Risposta del server:', data);
            if (data.message === 'Login riuscito') {
                sessionStorage.setItem('userEmail', data.email);
                sessionStorage.setItem('userName', data.name || 'Utente');
                alert('Login effettuato con successo!');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Errore durante il login');
            }
        })
        .catch(error => {
            console.error('Errore durante il login con Google:', error);
            alert('Errore di rete. Riprova più tardi.');
        });
    }

    // Gestione degli errori
    google.accounts.id.on('error', function(e) {
        console.error('Errore Google OAuth:', e);
        alert('Si è verificato un errore durante il processo di autenticazione. Riprova più tardi.');
    });

    
    // Chiamata per inizializzare il pulsante di login di Google quando il DOM è completamente caricato
    document.addEventListener('DOMContentLoaded', () => {
        initGoogleLogin();
    });

    // Invia il messaggio con il pulsante o premendo il tasto "Invio"
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
    document.addEventListener('DOMContentLoaded', handleDefaultFormEvents);
});
