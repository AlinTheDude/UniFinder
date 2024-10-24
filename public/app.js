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
document.addEventListener('DOMContentLoaded', function () {
    // Riferimento al form di login
    const loginForm = document.getElementById('loginForm');

    // Controlla se il form esiste nel DOM
    if (loginForm) {
        console.log('Login form trovato. Aggiungo event listener.');

        // Aggiungo event listener per l'invio del form
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();  // Prevenire il comportamento di default del form

            // Prendi i valori email e password dai campi di input
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // Effettua la richiesta di login
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })  // Invia i dati al server
                });

                // Trasforma la risposta in JSON
                const data = await response.json();

                // Se il login è riuscito
                if (response.ok) {
                    alert('Login effettuato con successo!');
                    console.log('Login riuscito:', data);
                } else {
                    // Mostra un messaggio di errore in caso di credenziali errate
                    const loginError = document.getElementById('loginError');
                    loginError.textContent = data.message || 'Credenziali non valide.';
                    loginError.style.display = 'block';  // Mostra l'errore
                    console.log('Errore di login:', data);
                }
            } catch (error) {
                // Gestione degli errori della fetch (ad es. problemi di connessione)
                console.error('Errore di rete:', error);
                alert('Si è verificato un errore. Riprova più tardi.');
            }
        });
    } else {
        console.log('Login form non trovato nel DOM.');
    }
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

    fetch('http://localhost:3001/ricerca-universita', {
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
