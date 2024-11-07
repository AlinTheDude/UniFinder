document.addEventListener('DOMContentLoaded', function() {
    // Funzione per attendere l'esistenza di un elemento nel DOM
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // Gestione della registrazione
// Gestione della registrazione
waitForElement('#registrationForm', () => {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const preferenze = document.getElementById('regPreferenze').value.trim();

            console.log("Dati del form di registrazione:", {
                nome: name,
                email: email,
                password: password,
                preferenze: preferenze
            });

            fetch('http://65.108.146.104:3001/registrazione', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
            })
           .then(response => {
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               return response.json();
           })
           .then(data => {
               console.log("Risposta dal server:", data);

               if (data.message === 'Registrazione completata') {
                   alert('Registrazione effettuata con successo!');
                   registrationForm.reset();
               } else {
                   alert(data.message || 'Errore durante la registrazione');
               }
           })
           .catch(error => {
               console.error('Errore durante la registrazione:', error);
               alert('Errore durante la registrazione. Riprova più tardi.');
           });
        });
    } else {
        console.warn("Elemento #registrationForm non trovato");
    }
});

    // Gestione del login
    waitForElement('#loginForm', () => {
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
                       // window.location.href = 'homepage.html'; // Disabilitato temporaneamente
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
        }
    });
});

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
