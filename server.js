const express = require('express');
const http = require('http'); // Questa deve essere la prima importazione
const cors = require('cors');
const session = require('express-session');
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
const config = require('./config');

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
app.use(express.static('public'));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


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
    console.log('1. Richiesta di registrazione ricevuta:', req.body);
    
    // Verifica 1: Dati del form
    console.log('2. Verifica dati form:', {
        nome: req.body.nome,
        email: req.body.email,
        password: '***' // Non mostrare la password
    });
    
    // Verifica 2: Validazione
    if (!req.body.nome || !req.body.email || !req.body.password) {
        console.log('3. Errore: campi obbligatori mancanti');
        return res.status(400).json({ error: 'Compila tutti i campi obbligatori' });
    }
    
    // Verifica 3: Database
    db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`, 
        [req.body.nome, req.body.email, req.body.password, req.body.preferenze],
        function (err) {
            if (err) {
                console.log('4. Errore database:', err.message);
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "Email già registrata" });
                }
                return res.status(500).json({ error: 'Errore durante la registrazione' });
            }
            console.log('5. Registrazione completata con successo');
            res.json({ message: 'Registrazione completata', id: this.lastID });
        }
    );
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

        // Aggiungi la sessione dell'utente
        req.session.user = row; // Salva i dati dell'utente nella sessione

        res.json({ message: 'Login riuscito', user: row });
    });
})

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

app.get('/utente', (req, res) => {
    const email = req.query.email;
    console.log('Richiesta dettagli utente per:', email);

    if (!email) {
        return res.status(400).json({ error: 'Email mancante' });
    }

    db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Errore durante il recupero dell\'utente:', err.message);
            return res.status(500).json({ error: 'Errore durante il recupero dei dati utente' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Restituisci i dettagli dell'utente
        res.json({ nome: row.nome, email: row.email });
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

server.listen(3001, () => {
    console.log('Server in esecuzione su http://localhost:3001');
});
