const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app); // Usa il server HTTP per supportare WebSocket
const wss = new WebSocket.Server({ server }); // Crea il server WebSocket
const port = 3001;
const dbPath = path.join(__dirname, 'database.db');
// MOCK DATABASE CONFIGURAZIONE
//const mockdb = [
    //{ id: 1, nome: "Università di Roma", paese: "Italia" },
    //{ id: 2, nome: "Harvard University", paese: "USA" },
    //{ id: 3, nome: "University of Tokyo", paese: "Giappone" }
//];

// Connessione al database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Errore nella connessione al database:', err.message);
    }
    console.log('Connesso al database SQLite.');
});

//app.get('/api/mockdb', (req, res) => {
  //  res.json(mockdb);
// });

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

wss.on('connection', (ws) => {
    console.log('Nuovo client connesso alla chat');

    // Quando il client invia un messaggio
    ws.on('message', (message) => {
        console.log('Messaggio ricevuto dal client:', message);
        
        // Invia il messaggio a tutti i client connessi
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Quando il client si disconnette
    ws.on('close', () => {
        console.log('Client disconnesso dalla chat');
    });
});

app.get('/utenti', (req, res) => {
    const query = 'SELECT * FROM utenti';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Errore nel recupero degli utenti:', err.message);
            res.status(500).json({ error: 'Errore nel recupero degli utenti' });
        } else {
            res.json(rows);
        }
    });
});

// Restituisce gli utenti con preferenze specifiche
app.get('/utenti-filtrati', (req, res) => {
    const query = `SELECT * FROM utenti WHERE preferenze LIKE '%Italia%' AND preferenze LIKE '%Informatica%'`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Errore nel recupero degli utenti filtrati:', err.message);
            res.status(500).json({ error: 'Errore nel recupero degli utenti filtrati' });
        } else {
            res.json(rows);
        }
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
