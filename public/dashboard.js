document.addEventListener('DOMContentLoaded', function () {
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
        window.location.href = 'login.html'; // Reindirizza se non c'è l'email
    }
    
    document.getElementById('email').innerText = email;
    
    fetch(`http://65.108.146.104:3001/utente?email=${email}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.nome || 'Non specificato';
        });

    // Menu hamburger per mobile
    const hamburger = document.querySelector('.hamburger-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
});
