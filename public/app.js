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
               alert(data.message);
               registrationForm.reset();
           })
           .catch(error => console.error('Errore:', error));
        });
    } else {
        console.warn("Elemento #registrationForm non trovato");
    }

    // Gestione del login
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
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
    });

    // Gestione della ricerca università
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const paese = document.getElementById('paese').value;
            const tasseMassime = document.getElementById('tasseMassime').value;
            const borseDiStudio = document.getElementById('borseDiStudio').value;
            const offertaFormativa = document.getElementById('offertaFormativa').value;
            const reputazioneMinima = document.getElementById('reputazioneMinima').value;

            console.log("Dati del form di ricerca università:", { paese, tasseMassime, borseDiStudio, offertaFormativa, reputazioneMinima });

            fetch('http://localhost:3001/ricerca-universita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paese: paese,
                    tasseMassime: tasseMassime,
                    borse_di_studio: borseDiStudio,
                    offerta_formativa: offertaFormativa,
                    reputazioneMinima: reputazioneMinima
                })
            })
           .then(response => response.json())
           .then(data => {
               let resultDiv = document.getElementById('result');
               resultDiv.innerHTML = ''; // Pulisce il contenuto precedente

               if (data.universita.length > 0) {
                   data.universita.forEach(universita => {
                       let p = document.createElement('p');
                       p.textContent = `Nome: ${universita.nome}, Paese: ${universita.paese}, Tasse: ${universita.tasse}, Reputazione: ${universita.reputazione}`;
                       resultDiv.appendChild(p);
                   });
               } else {
                   resultDiv.innerHTML = '<p>Nessuna università trovata.</p>';
               }
           })
           .catch(error => console.error('Errore:', error));
        });
    } else {
        console.warn("Elemento #searchForm non trovato");
    }
}

// Esegui la funzione init quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', init);

// Gestione degli eventi di default dei form
function handleDefaultFormEvents() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Previene l'invio predefinito del form
            event.preventDefault();
            
            // Qui puoi aggiungere il tuo codice personalizzato per gestire il submit del form
            console.log(`Form ${form.id} inviato`);
            
            // Se necessario, puoi eseguire il fetch o qualsiasi altra operazione qui
        });
    });
}

// Esegui la funzione handleDefaultFormEvents quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', handleDefaultFormEvents);
