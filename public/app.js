document.addEventListener('DOMContentLoaded', function() {
    // Funzione per attendere l'esistenza di un elemento nel DOM
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    waitForElement('.hamburger-menu', () => {
        const hamburger = document.querySelector(".hamburger-menu");
        const navLinks = document.querySelector(".navbar-links");

        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                hamburger.classList.toggle("active");
                navLinks.classList.toggle("active");
            });
        } else {
            console.warn("Elementi hamburger-menu o navbar-links non trovati");
        }
    });


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

    // Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
    document.addEventListener('DOMContentLoaded', handleDefaultFormEvents);
});
