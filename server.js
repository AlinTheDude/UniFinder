const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 80;
const dbPath = path.join(__dirname, 'database.db');

// Connessione al database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Errore nella connessione al database:', err.message);
    }
    console.log('Connesso al database SQLite.');
});

// Middleware per il parsing del JSON
app.use(express.json());
app.use(express.static('public'));

// Creazione della tabella 'utenti' se non esiste già
db.run(`CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    preferenze TEXT
)`, (err) => {
    if (err) {
        console.error('Errore nella creazione della tabella utenti:', err.message);
    }
});

// Creazione della tabella 'universita' se non esiste già
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

// Endpoint per la registrazione
app.post('/registrazione', (req, res) => {
    console.log('Richiesta di registrazione ricevuta:', req.body);  // Log iniziale

    // Verifica che i campi obbligatori siano presenti
    if (!req.body.nome || !req.body.email || !req.body.password) {
        console.error('Errore: campi obbligatori mancanti');
        return res.status(400).json({ error: 'Compila tutti i campi obbligatori' });
    }

    // Inserisci i dati nel database
    db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`,
        [req.body.nome, req.body.email, req.body.password, req.body.preferenze],
        function (err) {
            if (err) {
                // Verifica se l'errore è dovuto a un'email duplicata
                if (err.message.includes("UNIQUE constraint failed: utenti.email")) {
                    console.error('Errore: email già registrata');
                    return res.status(400).json({ error: "Email già registrata" });
                }
                // Log generico per altri errori del database
                console.error('Errore durante la registrazione nel database:', err.message);
                return res.status(500).json({ error: 'Errore durante la registrazione. Riprovare.' });
            }
            console.log('Registrazione completata con successo, ID utente:', this.lastID);
            res.json({ message: 'Registrazione completata', id: this.lastID });
        });
});

// Endpoint per il login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Richiesta di login ricevuta:', req.body);

    db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Errore durante il login:', err.message);
            return res.status(500).json({ error: 'Errore durante il login. Riprova più tardi.' });
        }

        if (!row) {
            console.log('Nessun utente trovato con questa email');
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        console.log('Utente trovato:', row);
        if (row.password !== password) {
            console.log('Password errata per l\'utente:', email);
            return res.status(401).json({ message: 'Password errata' });
        }

        res.json({ message: 'Login riuscito', user: row });
    });
});

// Endpoint per la ricerca università
app.post('/ricerca-universita', (req, res) => {
    const { paese, indirizzo, tasseMassime, borse_di_studio, offerta_formativa, reputazioneMinima } = req.body;
    console.log('Dati ricevuti per ricerca università:', req.body);

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
            console.error('Errore durante la ricerca università:', err.message);
            return res.status(500).json({ error: 'Errore durante la ricerca università. Riprova più tardi.' });
        }
        res.json({ universita: rows });
    });
});



// Gestione della chiusura del database alla chiusura del server
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Errore nella chiusura del database:', err.message);
        }
        console.log('Chiusura del database.');
        process.exit(0);
    });
});

// Avvio del server
app.listen(port, '65.108.146.104', () => {
    console.log(`Server API in esecuzione su http://65.108.146.104:${port}`);
});
