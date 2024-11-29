document.addEventListener('DOMContentLoaded', function() {
    const email = sessionStorage.getItem('userEmail'); // Ottieni l'email salvata durante il login

    // Carica preferenze al caricamento della dashboard
    fetch(`http://65.108.146.104:3001/preferenze?email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.preferenze) {
                document.getElementById('prefPaese').value = data.preferenze.paese || '';
                document.getElementById('prefCorsi').value = data.preferenze.corsi || '';
            }
        });

    // Salva preferenze
    document.getElementById('preferencesForm').addEventListener('submit', function(event) {
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
            document.getElementById('preferencesFeedback').innerText = data.message || 'Errore';
        });
    });
});