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
    document.addEventListener('DOMContentLoaded', function() {
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

                fetch('http://localhost:3001/registrazione', {
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
            loginForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value.trim();
                
                try {
                    const response = await fetch('http://localhost:3001/login', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ email, password }),
                        credentials: 'include' // Permette l'invio dei cookie
                    });
                    
                    if (response.status === 401) {
                        throw new Error('Credenziali non valide');
                    }
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Errore di autenticazione');
                    }
                    
                    return await response.json();
                    
                } catch (error) {
                    console.error('Errore di login:', error.message);
                    throw error;
                }
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
                fetch('http://localhost:3001/ricerca-universita', {
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

    // Invia il messaggio con il pulsante o premendo il tasto "Invio"
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
    document.addEventListener('DOMContentLoaded', handleDefaultFormEvents);
});
