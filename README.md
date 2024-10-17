UniFinder è un'applicazione che permette agli studenti di trovare l'università perfetta in base a preferenze personalizzate come località, costi, borse di studio e altro ancora. Questo documento descrive l'endpoint per l'autenticazione degli utenti, che consente agli studenti di accedere alla piattaforma.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#Requisiti Funzionali (Functional Requirements)

I requisiti funzionali definiscono cosa il sistema deve fare.

Registrazione degli utenti: Il sistema deve consentire agli utenti di creare un account fornendo email, nome, password, ecc.

Autenticazione degli utenti: Gli utenti devono poter effettuare il login con il proprio account per accedere ai servizi personalizzati.

Recupero password: Il sistema deve permettere agli utenti di recuperare la password tramite email.

Ricerca delle università: Gli utenti devono poter cercare università basate su criteri come località, costo delle rette, borse di studio, programmi offerti, reputazione accademica, ecc.

Filtraggio risultati: Il sistema deve permettere di applicare filtri ai risultati della ricerca per restringere il numero di università visualizzate.

Salvare università preferite: Gli utenti devono poter salvare università tra i preferiti per un accesso rapido in futuro.

Visualizzare e gestire università preferite: Gli utenti devono poter visualizzare e rimuovere le università precedentemente salvate nei preferiti.

Recensioni delle università: Gli utenti devono poter lasciare recensioni e valutazioni sulle università.

Modifica del profilo utente: Gli utenti devono poter aggiornare i propri dettagli di profilo, come nome, email e password.

Abilitare notifiche personalizzate: Gli utenti devono poter abilitare notifiche per eventi specifici, come scadenze per le borse di studio o aperture di nuove iscrizioni.

Cambiare lingua dell'interfaccia: Gli utenti devono poter cambiare la lingua dell'interfaccia del sito/app (multilingua).

Logout: Il sistema deve permettere agli utenti di disconnettersi.

Gestione amministrativa: Gli amministratori devono poter gestire i dati delle università, aggiungere nuove università, modificare informazioni esistenti e gestire le recensioni degli utenti.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#Requisiti Non Funzionali (Non-Functional Requirements)

I requisiti non funzionali descrivono le caratteristiche di qualità che il sistema deve rispettare.

Usabilità: L’interfaccia deve essere semplice da usare per gli utenti non tecnici, con una navigazione chiara e intuitiva.

Prestazioni: Il sistema deve poter gestire ricerche multiple in tempo reale e restituire i risultati in meno di 3 secondi.

Sicurezza:

Le password degli utenti devono essere cifrate.
Deve essere implementato un sistema di rate limiting per prevenire attacchi di brute force.
Deve essere presente il supporto per HTTPS per proteggere i dati durante la trasmissione.
I token JWT devono essere utilizzati per autenticazione sicura degli utenti.
Scalabilità: Il sistema deve poter gestire un aumento progressivo del numero di utenti e ricerche senza perdere in performance.

Manutenibilità: Il codice deve essere organizzato e documentato per facilitare gli aggiornamenti futuri e la correzione di bug.

Compatibilità: Il sistema deve funzionare su dispositivi mobili (responsività), tablet e desktop, nonché su vari browser (Chrome, Firefox, Safari, Edge).

Multilingua: Il sito deve supportare più lingue, con un sistema per la traduzione dinamica dei contenuti.

Accessibilità: Il sito deve rispettare le linee guida per l'accessibilità, garantendo l'uso per persone con disabilità.

Affidabilità: Il sistema deve essere operativo almeno il 99,9% del tempo, con downtime minimo per la manutenzione.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#Requisiti di Dominio (Domain Requirements)

I requisiti di dominio riguardano i vincoli specifici del dominio di applicazione.

Gestione dati delle università: Le informazioni su ogni università devono essere aggiornate regolarmente e devono includere dettagli come rette, borse di studio, programmi offerti, ecc.

Criteri accademici: I criteri per la selezione delle università devono includere aspetti come il ranking accademico, i corsi disponibili, le opportunità di tirocinio e la reputazione dell’istituzione.

Localizzazione geografica: Devono essere inclusi dati geografici dettagliati per ogni università, come città e paese.

Borse di studio e agevolazioni: Il sistema deve supportare la gestione di informazioni sulle borse di studio disponibili, con opzioni per filtrare le università che offrono agevolazioni finanziarie.

Ranking e valutazioni: Il sistema deve integrarsi con i ranking accademici internazionali e fornire un modo per classificare le università in base alla reputazione, qualità dei corsi e altro.

Privacy degli utenti: I dati personali degli utenti, come preferenze di ricerca e università salvate, devono essere protetti e non devono essere condivisi con terze parti senza il consenso dell’utente.

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

--------------------------------------------------------------------------------------------------------

Use Case Diagram:


