**COME AVVIARE IL PROGETTO**

# UniFinder - Guida all'installazione

## Configurazione sulla VM Alpine

1. Accedi alla VM tramite SSH:
   - In PuTTY: inserisci `localhost` come host e `2222` come porta
   - Utente: `mastroiannim`
   - Password: `paleocapa`
2. Clona il repository:
git clone https://github.com/AlinTheDude/UniFinder.git
3. Entra nella directory del progetto:
cd UniFinder
4. Installa le dipendenze:
npm install
5. Installa SQLite con le opzioni corrette:
npm install sqlite3 --build-from-source
npm rebuild sqlite3

6. Avvia l'applicazione:
node server.js

7. Accedi all'applicazione da un browser sul tuo computer:
   PRIMA DI TUTTO, ANDARE SU IMPOSTAZIONI DI RETE DELLA VIRTUAL MACHINE, E IMPOSTARE COME NOME UniFinder, come protocollo TCP, come Host Ip 127.0.0.1, e come due porte 3001.
- Apri il browser e vai all'indirizzo: `http://localhost:3001`


8. ADMIN LOGIN UNIFINDER
Username: admin
Password: Admin123!
Codice di sicurezza: UniFinder2024


---------------------------------------------------------------------------------------------------------------------------------------


UniFinder è un'applicazione progettata per semplificare la ricerca dell'università perfetta, basandosi su criteri personalizzati dell'utente. Gli studenti possono inserire le loro preferenze e ottenere una lista di università che meglio corrispondono alle loro esigenze. I criteri di ricerca includono indirizzo dell'università, paese specifico, costi di iscrizione e spese associate, opportunità di borse di studio, offerta formativa e reputazione accademica.

**Target**
---------------------------------------------------------------------------------------------------------------------------------------
Studenti

**Problema**
---------------------------------------------------------------------------------------------------------------------------------------
Opzioni per i studenti che hanno l'intenzione di frequentare l'universita e hanno criteri specifici per che tipologia di università cercano

**Competitor**
---------------------------------------------------------------------------------------------------------------------------------------
Niche, College Board - BigFuture, Cappex, College Scorecard, Unigo, Peterson’s, Fastweb, CollegeData, College XPress, The Princeton Review, Chegg College Search, College Navigator

**Tecnologie**
---------------------------------------------------------------------------------------------------------------------------------------
HTML, CSS, JS, GIT, SQL


**Requisiti Funzionali (Functional Requirements)**
---------------------------------------------------------------------------------------------------------------------------------------
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


**Requisiti Non Funzionali (Non-Functional Requirements)**
---------------------------------------------------------------------------------------------------------------------------------------

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

**Requisiti di Dominio (Domain Requirements)**
---------------------------------------------------------------------------------------------------------------------------------------

I requisiti di dominio riguardano i vincoli specifici del dominio di applicazione.

Gestione dati delle università: Le informazioni su ogni università devono essere aggiornate regolarmente e devono includere dettagli come rette, borse di studio, programmi offerti, ecc.

Criteri accademici: I criteri per la selezione delle università devono includere aspetti come il ranking accademico, i corsi disponibili, le opportunità di tirocinio e la reputazione dell’istituzione.

Localizzazione geografica: Devono essere inclusi dati geografici dettagliati per ogni università, come città e paese.

Borse di studio e agevolazioni: Il sistema deve supportare la gestione di informazioni sulle borse di studio disponibili, con opzioni per filtrare le università che offrono agevolazioni finanziarie.

Ranking e valutazioni: Il sistema deve integrarsi con i ranking accademici internazionali e fornire un modo per classificare le università in base alla reputazione, qualità dei corsi e altro.

Privacy degli utenti: I dati personali degli utenti, come preferenze di ricerca e università salvate, devono essere protetti e non devono essere condivisi con terze parti senza il consenso dell’utente.



**Use Case Diagram:**
--------------------------------------------------------------------------------------------------------
![image](https://github.com/user-attachments/assets/3776a3af-d922-4c7a-b633-4f68551eeeec)


