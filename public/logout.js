document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Pulisci sessionStorage
            sessionStorage.removeItem('userEmail');
            
            // Chiudi la sessione sul server
            fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Errore durante il logout:', error);
                window.location.href = 'login.html';
            });
        });
    }
});