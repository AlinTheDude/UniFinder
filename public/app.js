document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const preferenze = document.getElementById('regPreferenze').value;

    // Debug: verifica i valori raccolti dal form
    console.log("Dati del form di registrazione:", { name, email, password, preferenze });

    fetch('http://65.108.146.104:3001/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, email: email, password: password, preferenze: preferenze })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        this.reset();
    })
    .catch(error => console.error('Errore:', error));
});

// Funzione per gestire il login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
  
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
  
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
  
          const result = await response.json();
  
          if (result.message === 'Login riuscito') {
            showFeedback('Login effettuato con successo!', 'success');
            
            // Reindirizza l'utente dopo 2 secondi
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 2000);
          } else {
            showFeedback(result.message || 'Errore durante il login', 'error');
          }
        } catch (error) {
          console.error('Errore:', error);
          showFeedback('Errore di rete. Riprova più tardi.', 'error');
        }
      });
    } else {
      console.error('Elemento #loginForm non trovato');
    }
  });
  
  function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('loginFeedback');
    
    feedbackDiv.textContent = message;
    feedbackDiv.style.display = 'block';
    
    if (type === 'success') {
      feedbackDiv.style.color = 'green';
    } else {
      feedbackDiv.style.color = 'red';
    }
  
    setTimeout(() => {
      feedbackDiv.style.display = 'none';
    }, 5000); // Nasconde il feedback dopo 5 secondi
  }
  

function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('loginFeedback');
    
    feedbackDiv.textContent = message;
    feedbackDiv.style.display = 'block';
    
    if (type === 'success') {
        feedbackDiv.style.color = 'green';
    } else {
        feedbackDiv.style.color = 'red';
    }

    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 5000); // Nasconde il feedback dopo 5 secondi
}




// Funzione per gestire la ricerca delle università
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const paese = document.getElementById('paese').value;
    const tasseMassime = document.getElementById('tasseMassime').value;
    const borseDiStudio = document.getElementById('borseDiStudio').value;
    const offertaFormativa = document.getElementById('offertaFormativa').value;
    const reputazioneMinima = document.getElementById('reputazioneMinima').value;

    // Debug: verifica i dati raccolti dal form di ricerca università
    console.log("Dati del form di ricerca università:", { paese, tasseMassime, borseDiStudio, offertaFormativa, reputazioneMinima });

    fetch('http://localhost:3001/ricerca-universita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paese: paese, tasseMassime: tasseMassime, borse_di_studio: borseDiStudio, offerta_formativa: offertaFormativa, reputazioneMinima: reputazioneMinima })
    })
    .then(response => response.json())
    .then(data => {
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Pulisci il contenuto precedente
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
