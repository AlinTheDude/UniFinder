const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001; // Cambia la porta qui

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message);
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
    email TEXT,
    password TEXT,
    preferenze TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS universita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    paese TEXT,
    indirizzo TEXT,
    tasse INTEGER,
    borse_di_studio TEXT,
    offerta_formativa TEXT,
    reputazione INTEGER
)`);

// Endpoint di registrazione
app.post('/registrazione', (req, res) => {
    const { nome, email, password, preferenze } = req.body;

    db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`,
        [nome, email, password, preferenze],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Registrazione completata', id: this.lastID });
        });
});

// Endpoint di login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!row) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Verifica la password
        if (row.password !== password) {
            return res.status(401).json({ message: 'Password errata' });
        }

        res.json({ message: 'Login riuscito', user: row });
    });
});

// Endpoint per la ricerca università
app.post('/ricerca-universita', (req, res) => {
    const { paese, indirizzo, tasseMassime, borse_di_studio, offerta_formativa, reputazioneMinima } = req.body;

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
            return res.status(500).json({ error: err.message });
        }
        res.json({ universita: rows });
    });
});

// Chiude la connessione al database in caso di chiusura del server
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Chiusura del database.');
        process.exit(0);
    });
});

// Avvio del server
app.listen(port, () => {
    console.log(`Server API in esecuzione su http://localhost:${port}`);
});
