UniFinder è un'applicazione che permette agli studenti di trovare l'università perfetta in base a preferenze personalizzate come località, costi, borse di studio e altro ancora. Questo documento descrive l'endpoint per l'autenticazione degli utenti, che consente agli studenti di accedere alla piattaforma.

-----------------------------------------------------------

1. Criteri di Ricerca
Esempio di richiesta per cercare università in base a criteri specifici

Richiesta:
{
  "location": "Milano",
  "country": "Italia",
  "tuition_fee_range": {
    "min": 5000,
    "max": 15000
  },
  "scholarships": true,
  "programs": ["Ingegneria", "Economia"],
  "reputation": "alto"
}

Risposta:
{
  "status": "success",
  "message": "Università trovate.",
  "data": [
    {
      "university_id": 1,
      "name": "Università degli Studi di Milano",
      "tuition_fee": 12000,
      "scholarship_opportunities": true,
      "ranking": 150
    },
    {
      "university_id": 2,
      "name": "Politecnico di Milano",
      "tuition_fee": 13000,
      "scholarship_opportunities": true,
      "ranking": 50
    }
  ]
}
-----------------------------------------------------------

2. Salvataggio Università Preferite
Esempio di richiesta per salvare un'università nei preferiti dell'utente.

Richiesta:
{
  "user_id": 78910,
  "university_id": 1
}

Risposta:
{
  "status": "success",
  "message": "Università salvata tra i preferiti."
}
-----------------------------------------------------------

3. Recupero Università Salvate
Esempio di richiesta per recuperare le università salvate dall'utente.

Richiesta:
{
  "user_id": 78910
}

Risposta:
{
  "status": "success",
  "message": "Università preferite recuperate.",
  "data": [
    {
      "university_id": 1,
      "name": "Università degli Studi di Milano",
      "tuition_fee": 12000
    },
    {
      "university_id": 2,
      "name": "Politecnico di Milano",
      "tuition_fee": 13000
    }
  ]
}
-----------------------------------------------------------

4. Notifiche Personalizzate
Esempio di richiesta per abilitare le notifiche per un utente.

Richiesta:
{
  "user_id": 78910,
  "notifications": {
    "scholarships": true,
    "application_deadlines": true
  }
}

Risposta:
{
  "status": "success",
  "message": "Notifiche attivate."
}
-----------------------------------------------------------

5. Lingua dell'Interfaccia
Esempio di richiesta per cambiare la lingua dell'interfaccia.

Richiesta:
{
  "user_id": 78910,
  "preferred_language": "it"
}

Risposta:
{
  "status": "success",
  "message": "Lingua dell'interfaccia cambiata con successo."
}
-----------------------------------------------------------
6. Valutazioni e Recensioni
Esempio di richiesta per inviare una recensione su un'università.

Richiesta:
{
  "user_id": 78910,
  "university_id": 1,
  "rating": 4.5,
  "review": "Ottima università con buone opportunità di tirocinio."
}

Risposta:
{
  "status": "success",
  "message": "Recensione inviata con successo."
}

-----------------------------------------------------------

7. Recupero della Password
Esempio di richiesta per inviare una email per il recupero della password.

Richiesta:
{
  "email": "studente123@esempio.com"
}

Risposta:
{
  "status": "success",
  "message": "Un'email per il recupero della password è stata inviata."
}

-----------------------------------------------------------

8. Aggiornamento del Profilo Utente
Esempio di richiesta per aggiornare le informazioni del profilo utente.

Richiesta:
{
  "user_id": 78910,
  "name": "Giulia Rossi",
  "email": "giulia.rossi@esempio.com"
}

Risposta:
{
  "status": "success",
  "message": "Profilo aggiornato con successo."
}
-----------------------------------------------------------

9. Logout dell'Utente
Esempio di richiesta per effettuare il logout dell'utente.

Richiesta:
{
  "user_id": 78910,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Risposta:
{
  "status": "success",
  "message": "Logout effettuato con successo."
}
-----------------------------------------------------------
10. Suggester di Università Basato su AI
Esempio di richiesta per ottenere suggerimenti su università in base alle preferenze dell'utente.

Richiesta:
{
  "user_id": 78910,
  "preferences": {
    "location": "Milano",
    "programs": ["Ingegneria", "Design"],
    "budget": 15000
  }
}

Risposta:
{
  "status": "success",
  "message": "Università suggerite.",
  "data": [
    {
      "university_id": 3,
      "name": "NABA - Nuova Accademia di Belle Arti",
      "tuition_fee": 14000,
      "ranking": 200
    },
    {
      "university_id": 4,
      "name": "Università IULM",
      "tuition_fee": 10000,
      "ranking": 300
    }
  ]
}
-----------------------------------------------------------




