const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors'); // Per permettere richieste da client esterni
require('dotenv').config(); // Per caricare le variabili d'ambiente

const app = express();
const port = 3001;

// Percorso assoluto del database
const dbPath = path.join(__dirname, 'database.db');

// Connessione al database SQLite
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Errore nella connessione al database:', err.message);
    }
    console.log('Connesso al database SQLite.');
});

// Middleware
app.use(express.json());
app.use(cors()); // Abilita il CORS
app.use(express.static('public')); // Serve i file statici

// Creazione delle tabelle
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

// Funzione per generare token JWT
function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Middleware per autenticare il token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Accesso negato. Token mancante' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token non valido' });
        req.user = user;
        next();
    });
}

// Endpoint di registrazione
app.post('/registrazione', (req, res) => {
    const { nome, email, password, preferenze } = req.body;
    console.log('Dati ricevuti per registrazione:', req.body);

    // Hashing della password
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`,
        [nome, email, hashedPassword, preferenze],
        function (err) {
            if (err) {
                console.error('Errore durante la registrazione:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Registrazione completata', id: this.lastID });
        });
});

// Endpoint di login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Richiesta di login ricevuta:', req.body);

    db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Errore durante il login:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            console.log('Nessun utente trovato con questa email');
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const isPasswordValid = bcrypt.compareSync(password, row.password);
        if (!isPasswordValid) {
            console.log('Password errata per l\'utente:', email);
            return res.status(401).json({ message: 'Password errata' });
        }

        // Genera e restituisci il token
        const token = generateToken(row.id);
        res.json({ message: 'Login riuscito', token });
    });
});

// Endpoint per la ricerca università (protetto da autenticazione)
app.post('/ricerca-universita', authenticateToken, (req, res) => {
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
            return res.status(500).json({ error: err.message });
        }
        res.json({ universita: rows });
    });
});

// Endpoint di autenticazione per verificare il token
app.get('/api/auth', authenticateToken, (req, res) => {
    res.json({ authenticated: true });
});

// Chiude la connessione al database alla chiusura del server
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
