document.addEventListener('DOMContentLoaded', function() {
    // Funzione per aggiornare la UI in base allo stato di autenticazione
    function updateAuthUI(isLoggedIn, userData = null) {
        const authLinks = document.getElementById('authLinks');
        const userInfo = document.getElementById('userInfo');
        
        if (!authLinks || !userInfo) return;
        
        if (isLoggedIn && userData) {
            // Utente autenticato: mostra info utente e nascondi login/registrazione
            authLinks.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userName').textContent = userData.nome || 'Utente';
        } else {
            // Utente non autenticato: mostra login/registrazione e nascondi info utente
            authLinks.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    }
    
    // Controlla se l'utente è autenticato
    function checkAuthStatus() {
        // Prima controlla sessionStorage
        const email = sessionStorage.getItem('userEmail');
        
        if (email) {
            // Abbiamo un'email in sessionStorage, recupera i dati utente
            fetch(`http://localhost:3001/utente?email=${email}`)
                .then(response => {
                    if (!response.ok) throw new Error('Utente non trovato');
                    return response.json();
                })
                .then(data => {
                    updateAuthUI(true, data);
                })
                .catch(error => {
                    console.error('Errore nel recupero dati utente:', error);
                    // Rimuovi i dati non validi
                    sessionStorage.removeItem('userEmail');
                    updateAuthUI(false);
                });
        } else {
            // Nessuna email in sessionStorage, controlla la sessione lato server
            fetch('http://localhost:3001/user-info', {
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error('Non autenticato');
                    return response.json();
                })
                .then(data => {
                    // Salva l'email in sessionStorage per coerenza
                    sessionStorage.setItem('userEmail', data.email);
                    updateAuthUI(true, data);
                })
                .catch(error => {
                    console.error('Sessione non attiva:', error);
                    updateAuthUI(false);
                });
        }
    }
    
    // Esegui il controllo all'avvio
    checkAuthStatus();
    
    // Gestisci il logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pulisci sessionStorage
            sessionStorage.removeItem('userEmail');
            
            // Termina la sessione sul server
            fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include'
            })
                .then(() => {
                    // Aggiorna l'UI
                    updateAuthUI(false);
                    
                    // Reindirizza alla home se siamo nella dashboard
                    if (window.location.pathname.includes('dashboard')) {
                        window.location.href = 'index.html';
                    }
                })
                .catch(error => {
                    console.error('Errore durante il logout:', error);
                });
        });
    }
});