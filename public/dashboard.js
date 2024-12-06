document.addEventListener('DOMContentLoaded', function () {
    // Recupera i dati dell'utente da sessionStorage
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
        window.location.href = 'login.html'; // Se non è presente, reindirizza alla login
    }
    
    document.getElementById('email').innerText = email;
    
    // Chiamata API per ottenere il nome dell'utente
    fetch(`http://65.108.146.104:3001/utente?email=${email}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.nome || 'Non specificato';
        });

    // Gestione del menu mobile
    const hamburger = document.querySelector('.hamburger-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
});
