document.addEventListener("DOMContentLoaded", function() {
    // Funzione per gestire la registrazione
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
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
            if (data.success) this.reset();
        })
        .catch(error => console.error('Errore:', error));
    });

    // Funzione per gestire il login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('http://65.108.146.104:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert("Login effettuato con successo!");
                localStorage.setItem('token', data.token);
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

    // Funzione per gestire il logout
    document.getElementById("logoutButton").addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = "login.html";
    });

    // Funzione per verificare l'autenticazione
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        fetch('http://65.108.146.104:3001/api/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
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
