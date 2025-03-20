document.addEventListener('DOMContentLoaded', function () {
    // Recupera i dati dell'utente da sessionStorage
    const email = sessionStorage.getItem('userEmail');
    
    if (!email) {
        // Se non c'è email in sessionStorage, verifica se c'è una sessione attiva
        fetch('http://localhost:3001/user-info', {
            credentials: 'include' // Importante per inviare i cookie
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Sessione non valida');
            }
            return response.json();
        })
        .then(data => {
            // Utente autenticato tramite sessione
            document.getElementById('email').innerText = data.email;
            document.getElementById('username').innerText = data.nome || 'Non specificato';
        })
        .catch(error => {
            console.error('Errore di autenticazione:', error);
            window.location.href = 'login.html'; // Reindirizza alla login
        });
    } else {
        // Utente autenticato tramite sessionStorage
        document.getElementById('email').innerText = email;
        
        // Chiamata API per ottenere il nome dell'utente
        fetch(`http://localhost:3001/utente?email=${email}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('username').innerText = data.nome || 'Non specificato';
            })
            .catch(error => {
                console.error('Errore nel recupero dei dati utente:', error);
            });
    }

    // Gestione del menu mobile
    const hamburger = document.querySelector('.hamburger-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }
});