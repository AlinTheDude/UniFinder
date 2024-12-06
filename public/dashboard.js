document.addEventListener('DOMContentLoaded', function () {
    const email = sessionStorage.getItem('userEmail'); // Ottieni l'email salvata durante il login
    const username = sessionStorage.getItem('userName'); // Ottieni il nome salvato durante il login

    if (!email) {
        window.location.href = 'login.html'; // Se non c'è l'email, reindirizza al login
    }

    // Mostra email e nome dell'utente nel profilo
    document.getElementById('email').innerText = email;
    document.getElementById('username').innerText = username || 'Utente'; // Usa il nome salvato o un valore predefinito

    // Aggiungere un esempio di nome utente (da backend in futuro)
    // Se vuoi fare una richiesta al server per recuperare altre informazioni dell'utente:
    // fetch(`http://65.108.146.104:3001/utente?email=${email}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         document.getElementById('username').innerText = data.nome || 'Non specificato';
    //     });

    // Carica preferenze utente
    fetch(`http://65.108.146.104:3001/preferenze?email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.preferenze) {
                document.getElementById('prefPaese').value = data.preferenze.paese || '';
                document.getElementById('prefCorsi').value = data.preferenze.corsi || '';
            }
        });

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
            document.getElementById('preferencesFeedback').innerText = data.message || 'Errore';
        });
    });
});
