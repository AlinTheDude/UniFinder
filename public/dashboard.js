document.addEventListener('DOMContentLoaded', function () {
    const email = sessionStorage.getItem('userEmail'); // Ottieni l'email salvata durante il login
    const userName = sessionStorage.getItem('userName'); // Ottieni il nome salvato durante il login

    if (!email) {
        window.location.href = 'login.html'; // Se non c'è l'email, reindirizza al login
    }

    // Mostra i dati dell'utente nel profilo
    document.getElementById('userEmail').innerText = email;
    document.getElementById('userName').innerText = userName || 'Utente';

    // Carica preferenze utente dal backend
    fetch(`http://65.108.146.104:3001/preferenze?email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.preferenze) {
                document.getElementById('prefPaese').value = data.preferenze.paese || '';
                document.getElementById('prefCorsi').value = data.preferenze.corsi || '';
            }
        })
        .catch(error => console.error('Errore durante il caricamento delle preferenze:', error));

    // Salva preferenze
    document.getElementById('preferencesForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const paese = document.getElementById('prefPaese').value.trim();
        const corsi = document.getElementById('prefCorsi').value.trim();

        fetch('http://65.108.146.104:3001/preferenze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, paese, corsi })
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
});
