const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001; // Cambia la porta qui

// Percorso assoluto del database
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Errore nella connessione al database:', err.message);
    }
    console.log('Connesso al database SQLite.');
});

// Middleware per gestire il parsing JSON
app.use(express.json());
app.use(express.static('public')); // Serve i file statici

// Creazione della tabella 'utenti' e 'università'
db.run(`CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    password TEXT,
    preferenze TEXT
)`, (err) => {
    if (err) {
        console.error('Errore nella creazione della tabella utenti:', err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS universita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    paese TEXT,
    indirizzo TEXT,
    tasse INTEGER,
    borse_di_studio TEXT,
    offerta_formativa TEXT,
    reputazione INTEGER
)`, (err) => {
    if (err) {
        console.error('Errore nella creazione della tabella università:', err.message);
    }
});

// Endpoint di registrazione
app.post('/registrazione', (req, res) => {
    const { nome, email, password, preferenze } = req.body;
    console.log('Dati ricevuti per registrazione:', req.body); // Logging dei dati

    db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`,
        [nome, email, password, preferenze],
        function (err) {
            if (err) {
                console.error('Errore durante la registrazione:', err.message); // Mostra l'errore
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Registrazione completata', id: this.lastID });
        });
});

// Endpoint di login
// ... (il resto del codice rimane invariato)

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Richiesta di login ricevuta:', req.body); // Log dei dati di login

    // Cerca l'utente nel database
    db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Errore durante il login:', err.message);
            return res.status(500).json({ error: err.message });
        }

        // Se l'utente non esiste
        if (!row) {
            console.log('Nessun utente trovato con questa email'); // Log
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        console.log('Utente trovato:', row); // Log dell'utente trovato

        // Controlla la password
        console.log('Password memorizzata:', row.password); // Log della password memorizzata
        console.log('Password inviata:', password); // Log della password inviata

        if (row.password !== password) {
            console.log('Password errata per l\'utente:', email); // Log
            return res.status(401).json({ message: 'Password errata' });
        }

        res.json({ message: 'Login riuscito', user: row });
    });
});

// ... (il resto del codice rimane invariato)


// Endpoint per la ricerca università
app.post('/ricerca-universita', (req, res) => {
    const { paese, indirizzo, tasseMassime, borse_di_studio, offerta_formativa, reputazioneMinima } = req.body;
    console.log('Dati ricevuti per ricerca università:', req.body); // Logging dei dati

    let query = `SELECT * FROM universita WHERE 1=1`;
    let params = [];

    if (paese) {
        query += ` AND paese = ?`;
        params.push(paese);
    }
    if (indirizzo) {
        query += ` AND indirizzo = ?`;
        params.push(indirizzo);
    }
    if (tasseMassime) {
        query += ` AND tasse <= ?`;
        params.push(tasseMassime);
    }
    if (borse_di_studio) {
        query += ` AND borse_di_studio = ?`;
        params.push(borse_di_studio);
    }
    if (offerta_formativa) {
        query += ` AND offerta_formativa = ?`;
        params.push(offerta_formativa);
    }
    if (reputazioneMinima) {
        query += ` AND reputazione >= ?`;
        params.push(reputazioneMinima);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Errore durante la ricerca università:', err.message); // Mostra l'errore
            return res.status(500).json({ error: err.message });
        }
        res.json({ universita: rows });
    });
});



// Chiude la connessione al database in caso di chiusura del server
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error('Errore nella chiusura del database:', err.message);
        }
        console.log('Chiusura del database.');
        process.exit(0);
    });
});

// Avvio del server
app.listen(port, '65.108.146.104', () => {
    console.log(`Server API in esecuzione su http://65.108.146.104:${port}`);
});

