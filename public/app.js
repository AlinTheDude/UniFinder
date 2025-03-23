document.addEventListener('DOMContentLoaded', function() {
    // Funzione per attendere l'esistenza di un elemento nel DOM
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    const BASE_URL = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3001' 
    : 'https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev';

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
                    password: "***", // Non loggare la password
                    preferenze: preferenze
                });
    
fetch(`${BASE_URL}/registrazione`, {
                    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ 
        nome: name, 
        email: email, 
        password: password, 
        preferenze: preferenze 
    })
})
                .then(response => {
                    console.log('Status della risposta:', response.status);
                    return response.json().then(data => {
                        if (!response.ok) {
                            throw new Error(data.error || `Errore del server: ${response.status}`);
                        }
                        return data;
                    });
                })
                .then(data => {
                    console.log("Risposta dal server:", data);
                    alert('Registrazione effettuata con successo!');
                    registrationForm.reset();
                    // Opzionale: reindirizza alla pagina di login
                    // window.location.href = 'login.html';
                })
                .catch(error => {
                    console.error('Errore durante la registrazione:', error.message);
                    alert('Errore durante la registrazione: ' + error.message);
                });
            });
        } else {
            console.warn("Elemento #registrationForm non trovato");
        }
    });

    // Gestione del login
    waitForElement('#loginForm', () => {
        const loginForm = document.getElementById('loginForm');
        const toggleMode = document.getElementById('toggleMode');

        if (loginForm) {
            let isAdminMode = false;
            if (toggleMode) {
                const loginHeader = document.querySelector('.login-header');
                const adminFields = document.querySelectorAll('.admin-field');
                const headerTitle = document.querySelector('.login-header h2');
                const headerDesc = document.querySelector('.login-header p');
                const submitBtn = document.querySelector('.form-submit');
                
                toggleMode.addEventListener('click', function(e) {
                    e.preventDefault();
                    isAdminMode = !isAdminMode;
                    
                    const emailInput = document.getElementById('loginEmail');
                    
                    if (isAdminMode) {
                        // Passa a modalità admin
                        loginHeader.classList.add('admin-mode');
                        toggleMode.textContent = 'Torna al login utente';
                        headerTitle.innerHTML = '<span class="admin-badge"><i class="fas fa-shield-alt"></i> Area Riservata</span>Accesso Amministratore';
                        headerDesc.textContent = 'Inserisci le credenziali di amministrazione';
                        submitBtn.textContent = 'Accedi come Amministratore';
                        
                        // Cambia l'etichetta da "Email" a "Username"
                        document.querySelector('label[for="loginEmail"]').textContent = 'Username';
                        
                        // Cambia il tipo di input da "email" a "text"
                        emailInput.type = 'text';
                        emailInput.placeholder = 'Inserisci username amministratore';
                        
                        // Mostra campi admin
                        adminFields.forEach(field => field.style.display = 'block');
                    } else {
                        // Torna a modalità utente
                        loginHeader.classList.remove('admin-mode');
                        toggleMode.textContent = 'Accedi come amministratore';
                        headerTitle.textContent = 'Accedi al tuo account';
                        headerDesc.textContent = 'Inserisci le tue credenziali per accedere a UniFinder';
                        submitBtn.textContent = 'Accedi';
                        
                        // Ripristina l'etichetta "Email"
                        document.querySelector('label[for="loginEmail"]').textContent = 'Email';
                        
                        // Ripristina il tipo di input a "email"
                        emailInput.type = 'email';
                        emailInput.placeholder = 'Inserisci la tua email';
                        
                        // Nascondi campi admin
                        adminFields.forEach(field => field.style.display = 'none');
                    }
                });
            }
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value.trim();

                if (isAdminMode) {
                    const securityCode = document.getElementById('securityCode').value.trim();
                    
                    // Credenziali admin predefinite
                    if (email === 'admin' && password === 'Admin123!' && securityCode === 'UniFinder2024') {
                        // Login admin riuscito
                        localStorage.setItem('adminLoggedIn', 'true');
                        alert('Login amministratore effettuato con successo!');
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        alert('Credenziali amministratore non valide. Riprova.');
                    }
                } else {
                    // Codice esistente per il login utente normale
                    console.log("Tentativo di login con:", { email, password });
                }
                
                console.log("Tentativo di login con:", { email, password });
                
                fetch('${BASE_URL}/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Credenziali non valide');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Login riuscito:", data);
                    // Salva l'email dalla risposta del server
                    sessionStorage.setItem('userEmail', data.user.email);
                    alert('Login effettuato con successo!');
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    console.log('Errore di login:', error.message);
                    alert('Login fallito: ' + error.message);
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


    function checkUserLoggedIn() {
        const userEmail = sessionStorage.getItem('userEmail');
        
        if (userEmail) {
            // Utente loggato, recupera i dettagli
            fetch(`${BASE_URL}/utente?email=${userEmail}`, {
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Utente non trovato');
                }
                return response.json();
            })
            .then(userData => {
                // Aggiorna la navbar con le informazioni dell'utente
                updateNavbarWithUserInfo(userData);
            })
            .catch(error => {
                console.error('Errore nel recupero dei dati utente:', error);
                // Verifica se c'è una sessione attiva sul server
                checkServerSession();
            });
        } else {
            // Verifica se c'è una sessione attiva sul server
            checkServerSession();
        }
    }
    
    // Funzione per verificare la sessione sul server
    function checkServerSession() {
        fetch('${BASE_URL}/check-auth', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // Sessione valida, salviamo l'email in sessionStorage e aggiorniamo la UI
                sessionStorage.setItem('userEmail', data.user.email);
                updateNavbarWithUserInfo(data.user);
            } else {
                // Nessuna sessione attiva, mostra i link di login/registrazione
                updateNavbarForGuest();
            }
        })
        .catch(error => {
            console.error('Errore nella verifica della sessione:', error);
            updateNavbarForGuest();
        });
    }

    function updateNavbarWithUserInfo(userData) {
        const navbar = document.querySelector('nav ul');
        
        if (navbar) {
            // Cerca i link di login e registrazione
            const loginLink = Array.from(navbar.querySelectorAll('li a')).find(a => a.textContent.includes('Login'));
            const regLink = Array.from(navbar.querySelectorAll('li a')).find(a => a.textContent.includes('Registrazione'));
            
            // Controlla se esiste già l'elemento utente nella navbar
            let userNavItem = document.getElementById('user-nav-item');
            
            if (!userNavItem) {
                // Crea un nuovo elemento per la navbar
                userNavItem = document.createElement('li');
                userNavItem.id = 'user-nav-item';
                userNavItem.className = 'user-profile';
                
                // Aggiungi l'elemento alla navbar
                if (loginLink && loginLink.parentElement) {
                    navbar.insertBefore(userNavItem, loginLink.parentElement);
                } else {
                    navbar.appendChild(userNavItem);
                }
            }
            
            // Aggiorna il contenuto dell'elemento
            userNavItem.innerHTML = `
                <div class="user-welcome">
                    <img src="Imgs/user-avatar.png" alt="Avatar" class="user-avatar">
                    <span>Ciao, ${userData.nome || 'Utente'}</span>
                </div>
                <div class="user-dropdown">
                    <a href="dashboard.html">Dashboard</a>
                    <a href="#" id="logout-link">Logout</a>
                </div>
            `;
            
            // Nascondi i link di login e registrazione
            if (loginLink && loginLink.parentElement) {
                loginLink.parentElement.style.display = 'none';
            }
            if (regLink && regLink.parentElement) {
                regLink.parentElement.style.display = 'none';
            }
            
            // Aggiungi evento di logout
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
            
            // Aggiungi stile CSS inline
            const style = document.createElement('style');
            style.textContent = `
                .user-profile {
                    position: relative;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                .user-welcome {
                    display: flex;
                    align-items: center;
                    background-color: rgba(255, 255, 255, 0.2);
                    padding: 5px 10px;
                    border-radius: 20px;
                    transition: background-color 0.3s;
                }
                .user-welcome:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }
                .user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 8px;
                    border: 2px solid white;
                }
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background-color: white;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    display: none;
                    z-index: 1000;
                    min-width: 150px;
                }
                .user-profile:hover .user-dropdown {
                    display: block;
                }
                .user-dropdown a {
                    display: block;
                    padding: 10px 15px;
                    color: #333;
                    text-decoration: none;
                    transition: background-color 0.3s;
                }
                .user-dropdown a:hover {
                    background-color: #f5f5f5;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Funzione per aggiornare la navbar per gli utenti non autenticati
    function updateNavbarForGuest() {
        // Rimuovi l'elemento utente se esiste
        const userNavItem = document.getElementById('user-nav-item');
        if (userNavItem) {
            userNavItem.remove();
        }
        
        // Mostra i link di login e registrazione
        const navbar = document.querySelector('nav ul');
        if (navbar) {
            const loginLink = Array.from(navbar.querySelectorAll('li a')).find(a => a.textContent.includes('Login'));
            const regLink = Array.from(navbar.querySelectorAll('li a')).find(a => a.textContent.includes('Registrazione'));
            
            if (loginLink && loginLink.parentElement) {
                loginLink.parentElement.style.display = '';
            }
            if (regLink && regLink.parentElement) {
                regLink.parentElement.style.display = '';
            }
        }
    }
    
    // Funzione per effettuare il logout
    function logout() {
        fetch('${BASE_URL}/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            // Pulisci i dati di sessione locali
            sessionStorage.removeItem('userEmail');
            
            // Aggiorna la UI
            updateNavbarForGuest();
            
            // Mostra un messaggio di logout
            alert('Logout effettuato con successo');
            
            // Reindirizza alla homepage se siamo in dashboard
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Errore durante il logout:', error);
            alert('Si è verificato un errore durante il logout. Riprova.');
        });
    }

    

    // Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
    handleDefaultFormEvents();
    checkUserLoggedIn();
});
