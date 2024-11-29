document.addEventListener('DOMContentLoaded', function () {
    // Recupera i dati salvati nel sessionStorage al momento del login
    const email = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');

    // Se non ci sono dati di login, reindirizza alla pagina di login
    if (!email) {
        window.location.href = 'login.html';
        return;
    }

    // Mostra l'email e il nome dell'utente nella dashboard
    document.getElementById('email').innerText = email;
    document.getElementById('username').innerText = userName || 'Utente';

    // Carica le preferenze dal database (se esistono)
    fetch(`http://65.108.146.104:3001/preferenze?email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.preferenze) {
                document.getElementById('prefPaese').value = data.preferenze.paese || '';
                document.getElementById('prefCorsi').value = data.preferenze.corsi || '';
            }
        })
        .catch(error => console.error('Errore durante il caricamento delle preferenze:', error));

    // Gestione del salvataggio delle preferenze
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
