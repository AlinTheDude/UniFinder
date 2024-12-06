document.addEventListener('DOMContentLoaded', function () {
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
        window.location.href = 'login.html';
    }
    
    document.getElementById('email').innerText = email;

    fetch(`http://65.108.146.104:3001/utente?email=${email}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.nome || 'Non specificato';
            document.getElementById('lastLogin').innerText = data.lastLogin || 'Non Disponibile';
        })
        .catch(() => {
            document.getElementById('username').innerText = 'Errore';
        });

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
            const feedback = document.getElementById('preferencesFeedback');
            feedback.innerText = data.message || 'Preferenze salvate con successo';
            feedback.style.color = 'green';
        })
        .catch(() => {
            document.getElementById('preferencesFeedback').innerText = 'Errore durante il salvataggio';
        });
    });
});
