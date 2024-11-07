// Gestione della registrazione
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const preferenze = document.getElementById('regPreferenze').value;

    console.log("Dati del form di registrazione:", { name, email, password, preferenze });

    fetch('http://65.108.146.104:3001/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('registrationForm').reset();
    })
    .catch(error => console.error('Errore:', error));
});

// Gestione del login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

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
            alert('Login effettuato con successo!');
            // window.location.href = 'homepage.html'; 
        } else {
            alert(data.message || 'Errore durante il login');
        }
    })
    .catch(error => {
        console.error('Errore:', error);
        alert('Errore di rete. Riprova più tardi.');
    });
});

// Gestione della ricerca università
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const paese = document.getElementById('paese').value;
    const tasseMassime = document.getElementById('tasseMassime').value;
    const borseDiStudio = document.getElementById('borseDiStudio').value;
    const offertaFormativa = document.getElementById('offertaFormativa').value;
    const reputazioneMinima = document.getElementById('reputazioneMinima').value;

    console.log("Dati del form di ricerca università:", { paese, tasseMassime, borseDiStudio, offertaFormativa, reputazioneMinima });

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
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Pulisce il contenuto precedente

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
