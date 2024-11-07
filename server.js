const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Connetti al database SQLite
let db = new sqlite3.Database('./unifinder.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connesso al database SQLite.');
});

// Funzione per creare le tabelle se non esistono
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS universities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            tuition_fees REAL,
            scholarships BOOLEAN,
            academic_offerings TEXT,
            reputation INTEGER
        )
    `, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

createTables();

// Endpoint per la registrazione
app.post('/registrazione', (req, res) => {
    const { nome, email, password, preferenze } = req.body;

    // Hash della password
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [nome, email, hashedPassword],
        function(err) {
            if (err) {
                res.status(400).json({ message: 'Errore durante la registrazione' });
            } else {
                res.json({ message: 'Registrazione effettuata con successo' });
            }
        }
    );
});

// Endpoint per il login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err || !row) {
            res.status(401).json({ message: 'Credenziali non valide' });
        } else {
            const isValidPassword = bcrypt.compareSync(password, row.password);

            if (!isValidPassword) {
                res.status(401).json({ message: 'Credenziali non valide' });
            } else {
                const token = jwt.sign({ userId: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.json({ token: token });
            }
        }
    });
});

// Endpoint per il logout
app.post('/logout', (req, res) => {
    res.json({ message: 'Logout effettuato con successo' });
});

// Endpoint per la ricerca università
app.post('/ricerca-universita', (req, res) => {
    const { paese, tasseMassime, borseDiStudio, offertaFormativa, reputazioneMinima } = req.body;

    let query = `
        SELECT * FROM universities 
        WHERE country LIKE ?
          AND tuition_fees <= ?
          AND scholarships = ?
          AND academic_offerings LIKE ?
          AND reputation >= ?
    `;

    db.all(query, [`%${paese}%`, tasseMassime, borseDiStudio === 'Sì', `%${offertaFormativa}%`, reputazioneMinima], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Errore durante la ricerca' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint per verificare l'autenticazione
app.get('/api/auth', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ authenticated: false });
        } else {
            res.json({ authenticated: true });
        }
    });
});

// Avvio del server
app.listen(port, '65.108.146.104', () => {
    console.log(`Server API in esecuzione su http://65.108.146.104:${port}`);
});

