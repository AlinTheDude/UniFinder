document.addEventListener("DOMContentLoaded", function() {
    // Funzione per gestire la registrazione
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const preferenze = document.getElementById('regPreferenze').value;

        // Debug: verifica i valori raccolti dal form
        console.log("Dati del form di registrazione:", { name, email, password, preferenze });

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

    // Funzione per gestire il login
    document.addEventListener("DOMContentLoaded", function() {
        // Funzione per gestire il login
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Raccogliere i dati del form
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
    
            // Debug: verifica i dati del form di login
            console.log("Dati del form di login:", { email, password });
    
            fetch('http://65.108.146.104:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => {
                // Verifica se la risposta è andata a buon fine
                if (!response.ok) {
                    throw new Error('Errore nella risposta del server');
                }
                return response.json();
            })
            .then(data => {
                // Debug: stampa la risposta del server
                console.log("Risposta dal server:", data);
    
                // Controlla se il login ha avuto successo
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
    });

    // Funzione per gestire il logout
    document.getElementById("logoutButton").addEventListener("click", function(event) {
        event.preventDefault();
        // Esegui eventuali operazioni di logout, se necessario
        window.location.href = "login.html";
    }); 

    document.getElementById("loginButton").addEventListener("click", function(event) {
        event.preventDefault();
    
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        fetch("http://65.108.146.104:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Login avvenuto con successo!");
                window.location.href = "dashboard.html";
            } else {
                alert("Errore: " + data.message);
            }
        })
        .catch(error => console.error("Errore:", error));
    });

    // Funzione per gestire la ricerca delle università
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const paese = document.getElementById('paese').value;
        const tasseMassime = document.getElementById('tasseMassime').value;
        const borseDiStudio = document.getElementById('borseDiStudio').value;
        const offertaFormativa = document.getElementById('offertaFormativa').value;
        const reputazioneMinima = document.getElementById('reputazioneMinima').value;

        // Debug: verifica i dati raccolti dal form di ricerca università
        console.log("Dati del form di ricerca università:", { paese, tasseMassime, borseDiStudio, offertaFormativa, reputazioneMinima });

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
});
