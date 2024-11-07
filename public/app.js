// Funzione principale che contiene tutto il nostro codice
function init() {
    // Gestione della registrazione
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const preferenze = document.getElementById('regPreferenze').value;

            console.log("Dati del form di registrazione:", { name, email, password, preferenze });

            fetch('http://65.108.146.104:3001/registrazione', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
            })
           .then(response => response.json())
           .then(data => {
               console.log("Risposta dal server:", data);

               if (data.message === 'Registrazione effettuata') {
                   alert('Registrazione effettuata con successo!');
                   registrationForm.reset();
               } else {
                   alert(data.message || 'Errore durante la registrazione');
               }
           })
           .catch(error => {
               console.error('Errore:', error);
               alert('Errore di rete. Riprova più tardi.');
           });
        });
    } else {
        console.warn("Elemento #registrationForm non trovato");
        
        // Aggiungi un event listener per quando il form viene aggiunto dinamicamente
        document.addEventListener('DOMSubtreeModified', function() {
            const registrationForm = document.getElementById('registrationForm');
            
            if (registrationForm) {
                console.log("Form #registrationForm trovato dopo l'inizializzazione");
                
                // Il tuo codice per gestire il submit del form qui
                registrationForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    const name = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    const password = document.getElementById('regPassword').value;
                    const preferenze = document.getElementById('regPreferenze').value;

                    console.log("Dati del form di registrazione:", { name, email, password, preferenze });

                    fetch('http://65.108.146.104:3001/registrazione', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
                    })
                   .then(response => response.json())
                   .then(data => {
                       console.log("Risposta dal server:", data);

                       if (data.message === 'Registrazione effettuata') {
                           alert('Registrazione effettuata con successo!');
                           registrationForm.reset();
                       } else {
                           alert(data.message || 'Errore durante la registrazione');
                       }
                   })
                   .catch(error => {
                       console.error('Errore:', error);
                       alert('Errore di rete. Riprova più tardi.');
                   });
                });
            }
        });
    }

    // Gestione del login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
           
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log("Dati del form di login:", { email, password });

            fetch('http://65.108.146.104:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
           .then(response => response.json())
           .then(data => {
               console.log("Risposta dal server:", data);

               if (data.message === 'Login riuscito') {
                   alert('Login effettuato con successo!');
                   // window.location.href = 'homepage.html';
               } else {
                   alert(data.message || 'Errore durante il login');
               }
           })
           .catch(error => {
               console.error('Errore:', error);
               alert('Errore di rete. Riprova più tardi.');
           });
        });
    } else {
        console.warn("Elemento #loginForm non trovato");
        
        // Aggiungi un event listener per quando il form viene aggiunto dinamicamente
        document.addEventListener('DOMSubtreeModified', function() {
            const loginForm = document.getElementById('loginForm');
            
            if (loginForm) {
                console.log("Form #loginForm trovato dopo l'inizializzazione");
                
                // Il tuo codice per gestire il submit del form qui
                loginForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    const email = document.getElementById('loginEmail').value;
                    const password = document.getElementById('loginPassword').value;

                    console.log("Dati del form di login:", { email, password });

                    fetch('http://65.108.146.104:3001/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, password: password })
                    })
                   .then(response => response.json())
                   .then(data => {
                       console.log("Risposta dal server:", data);

                       if (data.message === 'Login riuscito') {
                           alert('Login effettuato con successo!');
                           // window.location.href = 'homepage.html';
                       } else {
                           alert(data.message || 'Errore durante il login');
                       }
                   })
                   .catch(error => {
                       console.error('Errore:', error);
                       alert('Errore di rete. Riprova più tardi.');
                   });
                });
            }
        });
    }

    // Funzione per gestire gli eventi predefiniti dei form
    function handleDefaultFormEvents() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                console.log(`Form ${form.id} inviato`);
                event.preventDefault();
                
                // Qui puoi aggiungere il tuo codice personalizzato per gestire il submit del form
            });
        });
    }

    // Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
    document.addEventListener('DOMContentLoaded', handleDefaultFormEvents);
}

// Esegui la funziona init quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', init);
