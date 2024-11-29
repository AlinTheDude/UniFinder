document.addEventListener('DOMContentLoaded', function () {
    // Funzione per attendere l'esistenza di un elemento nel DOM
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // Gestione della dashboard
    waitForElement('#dashboard', () => {
        const dashboard = document.getElementById('dashboard');
        
        if (dashboard) {
            dashboard.innerHTML = `
                <h1>BENVENUTO NELLA DASHBOARD</h1>
                <p>Username: <span id="username"></span></p>
                <p>Email: <span id="email"></span></p>
                <p>Ruolo: <span id="user-role"></span></p>
                <p><strong>Preferenze:</strong></p>
                <input type="text" id="prefPaese" placeholder="Paese">
                <input type="text" id="prefCorsi" placeholder="Corso">
                <button type="submit">Salva Preferenze</button>
                <div id="preferencesFeedback"></div>
            `;

            // Gestione del form di modifica delle preferenze
            const preferencesForm = document.getElementById('preferencesForm');
            if (preferencesForm) {
                preferencesForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    
                    const paese = document.getElementById('prefPaese').value.trim();
                    const corsi = document.getElementById('prefCorsi').value.trim();

                    fetch('http://65.108.146.104:3001/preferenze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: sessionStorage.getItem('userEmail'), paese, corsi })
                    })
                       .then(response => response.json())
                       .then(data => {
                            document.getElementById('preferencesFeedback').innerText = data.message || 'Preferenze aggiornate con successo.';
                        })
                       .catch(error => {
                           console.error('Errore durante il salvataggio delle preferenze:', error);
                           document.getElementById('preferencesFeedback').innerText = 'Errore durante il salvataggio delle preferenze.';
                       });
                });
            }

            // Carica le preferenze dell'utente
            fetch(`http://65.108.146.104:3001/preferenze?email=${sessionStorage.getItem('userEmail')}`)
               .then(response => response.json())
               .then(data => {
                    if (data.preferenze) {
                        document.getElementById('prefPaese').value = data.preferenze.paese || '';
                        document.getElementById('prefCorsi').value = data.preferenze.corsi || '';
                    }
                })
               .catch(error => console.error('Errore durante il caricamento delle preferenze:', error));
        } else {
            console.warn("Elemento #dashboard non trovato");
        }
    });

    // Gestione del logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('userName');
            window.location.href = 'login.html';
        });
    }
});