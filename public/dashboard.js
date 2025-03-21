document.addEventListener('DOMContentLoaded', function () {
    const userInfoContainer = document.getElementById('user-info');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Funzione per reindirizzare alla pagina di login
    function redirectToLogin() {
        window.location.href = 'login.html';
    }
    
    // Funzione per verificare l'autenticazione
    function checkAuthentication() {
        // Prima controlla sessionStorage
        const storedEmail = sessionStorage.getItem('userEmail');
        
        if (storedEmail) {
            // Se abbiamo l'email in sessionStorage, verifichiamo che sia valida
            fetch(`https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev/utente?email=${storedEmail}`, {
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Utente non trovato');
                }
                return response.json();
            })
            .then(userData => {
                // Aggiorna gli elementi della pagina con i dati dell'utente
                displayUserData(userData);
            })
            .catch(error => {
                console.error('Errore nel recupero dei dati utente:', error);
                // Proviamo a vedere se c'è una sessione attiva sul server
                checkServerSession();
            });
        } else {
            // Se non abbiamo l'email in sessionStorage, controlliamo la sessione sul server
            checkServerSession();
        }
    }
    
    // Funzione per verificare la sessione sul server
    function checkServerSession() {
        fetch('https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev/check-auth', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // Sessione valida, salviamo l'email in sessionStorage e visualizziamo i dati
                sessionStorage.setItem('userEmail', data.user.email);
                displayUserData(data.user);
            } else {
                // Nessuna sessione valida, reindirizza al login
                console.log('Nessuna sessione attiva trovata');
                redirectToLogin();
            }
        })
        .catch(error => {
            console.error('Errore nella verifica della sessione:', error);
            redirectToLogin();
        });
    }
    
    // Funzione per visualizzare i dati dell'utente
    function displayUserData(userData) {
        if (usernameElement) {
            usernameElement.textContent = userData.nome || 'Utente';
        }
        
        if (emailElement) {
            emailElement.textContent = userData.email || 'Email non disponibile';
        }
        
        // Mostra il contenitore delle informazioni utente
        if (userInfoContainer) {
            userInfoContainer.style.display = 'block';
        }
        updateNavbar(userData);
    }
    
    // Funzione per aggiornare la navbar con le informazioni dell'utente
    function updateNavbar(userData) {
        // Cerca la navbar
        const navbar = document.querySelector('nav ul');
        
        if (navbar) {
            // Controlla se esiste già l'elemento utente nella navbar
            let userNavItem = document.getElementById('user-nav-item');
            
            if (!userNavItem) {
                // Crea un nuovo elemento per la navbar
                userNavItem = document.createElement('li');
                userNavItem.id = 'user-nav-item';
                userNavItem.className = 'user-profile';
                
                // Aggiungi l'elemento alla navbar (prima dell'ultimo elemento)
                navbar.insertBefore(userNavItem, navbar.lastElementChild);
            }
            
            // Aggiorna il contenuto dell'elemento
            userNavItem.innerHTML = `
                <div class="user-welcome">
                    <img src="Imgs/user-avatar.png" alt="Avatar" class="user-avatar">
                    <span>Ciao, ${userData.nome || 'Utente'}</span>
                </div>
            `;
            
            // Aggiungi stile CSS inline
            const style = document.createElement('style');
            style.textContent = `
                .user-profile {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                }
                .user-welcome {
                    display: flex;
                    align-items: center;
                    background-color: rgba(255, 255, 255, 0.2);
                    padding: 5px 10px;
                    border-radius: 20px;
                }
                .user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Gestione del logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch('https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                // Pulisci i dati di sessione locali
                sessionStorage.removeItem('userEmail');
                
                // Reindirizza alla homepage o alla pagina di login
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Errore durante il logout:', error);
                alert('Si è verificato un errore durante il logout. Riprova.');
            });
        });
    }
    
    // Verifica l'autenticazione all'avvio
    checkAuthentication();
    
    // Funzione per caricare i contenuti della dashboard
    function loadDashboardContent() {
        // Qui puoi aggiungere il codice per caricare i contenuti specifici della dashboard
        // come statistiche, preferiti, ecc.
        
        // Esempio: Carica le università preferite
        const preferitiContainer = document.getElementById('preferiti-container');
        
        if (preferitiContainer) {
            const email = sessionStorage.getItem('userEmail');
            
            if (email) {
                fetch(`https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev/preferiti?email=${email}`, {
                    credentials: 'include'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nel caricamento dei preferiti');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        let html = '<h3>Le tue università preferite</h3><ul>';
                        data.forEach(univ => {
                            html += `<li>${univ.nome} - ${univ.paese}</li>`;
                        });
                        html += '</ul>';
                        preferitiContainer.innerHTML = html;
                    } else {
                        preferitiContainer.innerHTML = '<h3>Nessuna università preferita</h3><p>Esplora le università e aggiungile ai preferiti!</p>';
                    }
                })
                .catch(error => {
                    console.error('Errore:', error);
                    preferitiContainer.innerHTML = '<p>Impossibile caricare i preferiti. Riprova più tardi.</p>';
                });
            }
        }
    }
    
    // Carica i contenuti della dashboard se l'utente è autenticato
    if (sessionStorage.getItem('userEmail')) {
        loadDashboardContent();
    }
});