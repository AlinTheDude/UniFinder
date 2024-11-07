document.addEventListener("DOMContentLoaded", function() {
    // Funzione per gestire la registrazione
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const preferenze = document.getElementById('regPreferenze').value;

            fetch('http://65.108.146.104:3001/registrazione', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.reset();
            })
            .catch(error => console.error('Errore:', error));
        });
    }

    // Funzione per gestire il login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            fetch('http://65.108.146.104:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Login effettuato con successo!");
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message || 'Errore durante il login');
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Errore di rete o del server. Controlla la console per maggiori dettagli.');
            });
        });
    }

    // Funzione per gestire il logout
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            fetch('http://65.108.146.104:3001/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "login.html";
                } else {
                    alert(data.message || 'Errore durante il logout');
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Errore di rete o del server. Controlla la console per maggiori dettagli.');
            });
        });
    }

    // Funzione per gestire la ricerca delle università
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const paese = document.getElementById('paese').value;
            const tasseMassime = document.getElementById('tasseMassime').value;
            const borseDiStudio = document.getElementById('borseDiStudio').value;
            const offertaFormativa = document.getElementById('offertaFormativa').value;
            const reputazioneMinima = document.getElementById('reputazioneMinima').value;

            fetch('http://65.108.146.104:3001/ricerca-universita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paese: paese, tasseMassime: tasseMassime, borse_di_studio: borseDiStudio, offerta_formativa: offertaFormativa, reputazioneMinima: reputazioneMinima })
            })
            .then(response => response.json())
            .then(data => {
                let resultDiv = document.getElementById('result');
                resultDiv.innerHTML = ''; // Pulisci il contenuto precedente
                if (data.universita.length > 0) {
                    data.universita.forEach(universita => {
                        let p = document.createElement('p');
                        p.textContent = `Nome: ${universita.nome}, Paese: ${universita.paese}, Tasse: ${universita.tasse}, Reputazione: ${universita.reputazione}`;
                        resultDiv.appendChild(p);
                    });
                } else {
                    resultDiv.innerHTML = '<p>Nessuna università trovata.</p>';
                }
            })
            .catch(error => console.error('Errore:', error));
        });
    }

    // Funzione per verificare l'autenticazione
    function checkAuth() {
        fetch('http://65.108.146.104:3001/api/auth', { method: 'GET' })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data.authenticated) {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Errore durante la verifica dell\'autenticazione:', error);
                window.location.href = 'login.html';
            });
    }

    // Chiamata iniziale alla funzione di controllo
    checkAuth();
});
