const express = require('express');
const http = require('http'); // Questa deve essere la prima importazione
const cors = require('cors');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
let visitatoriOnline = 0;
const clientAttivi = new Map();
require('dotenv').config();
const WebSocket = require('ws');
const app = express();
const axios = require('axios');
const server = http.createServer(app); // Usa il server HTTP per supportare WebSocket
const wss = new WebSocket.Server({ server }); // Crea il server WebSocket
const port = 3001;
const dbPath = path.join(__dirname, 'database.db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://glowing-guacamole-r47qvpjxj99fpvrr-3000.app.github.dev',
    // Aggiungi altri domini se necessario
];

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
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev',
        // Aggiungi qui l'URL del tuo client
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use(session({
    secret: 'unfinderSecretKey2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true in produzione, false in sviluppo
        maxAge: 24 * 60 * 60 * 1000, // 24 ore
        sameSite: 'lax'
    }
}));

// Middleware per verificare l'autenticazione
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Non autenticato' });
    }
}

// Endpoint per verificare se l'utente è autenticato
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ 
            authenticated: true, 
            user: {
                id: req.session.user.id,
                nome: req.session.user.nome,
                email: req.session.user.email
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM utenti WHERE id = ?', [id], (err, row) => {
        done(err, row);
    });
});

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'UniFinder API',
        version: '1.0.0',
        description: 'API per la gestione di UniFinder',
        contact: {
          name: 'Sviluppatore UniFinder',
          email: 'info@unifinder.it'
        }
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Server di sviluppo'
        },
        {
          url: 'https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev',
          description: 'Server GitHub Codespaces'
        }
      ]
    },
    apis: ['./server.js'] // file che contengono le annotazioni Swagger
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  // Rotta per la documentazione Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Endpoint per il file swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Errore durante la chiusura della sessione:', err);
            return res.status(500).json({ error: 'Errore durante il logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout effettuato con successo' });
    });
});

const getCallbackURL = () => {
    // Controlla se è in esecuzione su GitHub Codespaces o in locale
    if (process.env.CODESPACES) {
      return 'https://glowing-guacamole-r47qvpjxj99fpvrr-3001.app.github.dev/auth/google/callback';
    } else {
      return 'http://localhost:3001/auth/google/callback';
    }
  };


// Configurazione della strategia Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: getCallbackURL(),
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, (accessToken, refreshToken, profile, done) => {
    console.log('Profilo Google ricevuto:', profile);
    
    // Controlla se l'utente esiste già nel database
    db.get('SELECT * FROM utenti WHERE email = ?', [profile.emails[0].value], (err, row) => {
        if (err) {
            console.error('Errore nella ricerca dell\'utente:', err);
            return done(err);
        }
        
        if (row) {
            // L'utente esiste già, restituiscilo
            console.log('Utente esistente trovato:', row);
            return done(null, row);
        } else {
            // Crea un nuovo utente
            const randomPassword = Math.random().toString(36).slice(-8); // Password casuale
            console.log('Creazione nuovo utente con email:', profile.emails[0].value);
            
            db.run(`INSERT INTO utenti (nome, email, password, preferenze) VALUES (?, ?, ?, ?)`, 
                [profile.displayName, profile.emails[0].value, randomPassword, ''],
                function (err) {
                    if (err) {
                        console.error('Errore nella creazione dell\'utente:', err);
                        return done(err);
                    }
                    
                    // Recupera l'utente appena creato
                    db.get('SELECT * FROM utenti WHERE id = ?', [this.lastID], (err, newUser) => {
                        console.log('Nuovo utente creato:', newUser);
                        return done(null, newUser);
                    });
                }
            );
        }
    });
}));

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


app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // Autenticazione riuscita
        console.log('Login con Google riuscito, utente:', req.user);
        req.session.user = req.user;
        
        // Salva anche in sessionStorage attraverso un cookie o un redirect con parametri
        res.redirect('/auth-success.html?email=' + encodeURIComponent(req.user.email));
    }
);

// Endpoint per recuperare i dati dell'utente dalla sessione
app.get('/user-info', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autenticato' });
    }
    
    res.json({
        id: req.session.user.id,
        nome: req.session.user.nome,
        email: req.session.user.email
    });
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

/**
 * @swagger
 * /registrazione:
 *   post:
 *     summary: Registra un nuovo utente
 *     description: Crea un nuovo utente nel sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome dell'utente
 *               email:
 *                 type: string
 *                 description: Email dell'utente
 *               password:
 *                 type: string
 *                 description: Password dell'utente
 *               preferenze:
 *                 type: string
 *                 description: Preferenze dell'utente
 *     responses:
 *       200:
 *         description: Registrazione completata con successo
 *       400:
 *         description: Errore nei dati inviati
 *       500:
 *         description: Errore del server
 */

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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Effettua il login di un utente
 *     description: Autentica un utente nel sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email dell'utente
 *               password:
 *                 type: string
 *                 description: Password dell'utente
 *     responses:
 *       200:
 *         description: Login riuscito
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore del server
 */

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

/**
 * @swagger
 * /ricerca-universita:
 *   post:
 *     summary: Ricerca università
 *     description: Cerca università in base ai criteri specificati
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paese:
 *                 type: string
 *                 description: Paese dell'università
 *               indirizzo:
 *                 type: string
 *                 description: Indirizzo dell'università
 *               tasseMassime:
 *                 type: number
 *                 description: Tasse massime
 *               borse_di_studio:
 *                 type: string
 *                 description: Disponibilità di borse di studio
 *               offerta_formativa:
 *                 type: string
 *                 description: Offerta formativa
 *               reputazioneMinima:
 *                 type: number
 *                 description: Reputazione minima
 *     responses:
 *       200:
 *         description: Risultati della ricerca
 *       500:
 *         description: Errore del server
 */


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
    // Assegna un ID univoco a ogni connessione
    const clientId = Date.now() + Math.random().toString(36).substr(2, 9);
    clientAttivi.set(clientId, ws);
    
    console.log(`Nuovo client connesso (ID: ${clientId}). Totale connessioni: ${clientAttivi.size}`);
    visitatoriOnline = clientAttivi.size;
    
    // Invia l'aggiornamento del contatore a tutti
    inviaConcatoreATutti();
    
    // Imposta un ping periodico per verificare se il client è ancora connesso
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    
    // Quando il client invia un messaggio
    ws.on('message', (message) => {
        try {
            const messaggio = JSON.parse(message.toString());
            
            // Gestisci solo i messaggi di tipo chat, ignora connessione/disconnessione
            // perché ora gestiamo quelli automaticamente
            if (messaggio.tipo !== 'connessione' && messaggio.tipo !== 'disconnessione') {
                // Inoltra il messaggio agli altri client (per la chat)
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            }
        } catch (error) {
            console.error('Errore nel parsing del messaggio WebSocket:', error);
            // Se non è JSON, trattalo come messaggio normale
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        }
    });

    // Quando il client si disconnette
    ws.on('close', () => {
        console.log(`Client disconnesso (ID: ${clientId})`);
        clientAttivi.delete(clientId);
        visitatoriOnline = clientAttivi.size;
        inviaConcatoreATutti();
    });
    
    // Invia il contatore attuale al nuovo client
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            tipo: 'contatore-visitatori',
            conteggio: visitatoriOnline
        }));
    }
});

// Imposta un intervallo per verificare periodicamente se i client sono ancora connessi
const intervalloVerifica = setInterval(() => {
    let clientDisconnessi = 0;
    
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            clientDisconnessi++;
            return ws.terminate(); // Termina la connessione se non risponde
        }
        
        ws.isAlive = false;
        ws.ping(() => {});
    });
    
    if (clientDisconnessi > 0) {
        console.log(`Rimosse ${clientDisconnessi} connessioni inattive`);
        // Aggiorna il contatore solo se abbiamo rimosso client
        visitatoriOnline = clientAttivi.size;
        inviaConcatoreATutti();
    }
}, 30000); // Verifica ogni 30 secondi

// Pulisci l'intervallo quando il server viene chiuso
wss.on('close', () => {
    clearInterval(intervalloVerifica);
});

// Funzione per inviare l'aggiornamento del contatore a tutti i client
function inviaConcatoreATutti() {
    const messaggioContatore = JSON.stringify({
        tipo: 'contatore-visitatori',
        conteggio: visitatoriOnline
    });
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messaggioContatore);
        }
    });
}

/**
 * @swagger
 * /utenti:
 *   get:
 *     summary: Recupera tutti gli utenti
 *     description: Restituisce un array di tutti gli utenti registrati nel sistema
 *     responses:
 *       200:
 *         description: Un array di utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID dell'utente
 *                   nome:
 *                     type: string
 *                     description: Nome dell'utente
 *                   email:
 *                     type: string
 *                     description: Email dell'utente
 *                   preferenze:
 *                     type: string
 *                     description: Preferenze dell'utente
 *       500:
 *         description: Errore del server
 */

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
app.get('/utenti/filtro', (req, res) => {
    const { nome, email } = req.query;
    let query = 'SELECT * FROM utenti WHERE 1=1';
    let params = [];

    if (nome) {
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    
    if (email) {
        query += ' AND email LIKE ?';
        params.push(`%${email}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Errore nel filtraggio degli utenti:', err.message);
            res.status(500).json({ error: 'Errore nel filtraggio degli utenti' });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/universities', async (req, res) => {
    try {
      const { country } = req.query;
      
      if (!country) {
        return res.status(400).json({ error: 'È necessario specificare un paese per la ricerca' });
      }
      
      const url =  'http://universities.hipolabs.com/search';
      
      const response = await axios.get(url, { params: { country } });
      res.json(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle università:', error);
      res.status(500).json({ error: 'Errore nel recupero delle università' });
    }
  });

function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Accesso non autorizzato' });
    }
}

// Endpoint per ottenere tutti gli utenti (solo admin)
app.get('/admin/utenti', requireAdmin, (req, res) => {
    db.all('SELECT id, nome, email, preferenze FROM utenti', [], (err, rows) => {
        if (err) {
            console.error('Errore nel recupero degli utenti:', err);
            return res.status(500).json({ error: 'Errore nel recupero degli utenti' });
        }
        res.json({ utenti: rows });
    });
});

// Endpoint per ottenere un singolo utente (solo admin)
app.get('/admin/utenti/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;
    
    db.get('SELECT id, nome, email, preferenze FROM utenti WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Errore nel recupero dell\'utente:', err);
            return res.status(500).json({ error: 'Errore nel recupero dell\'utente' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        
        res.json({ utente: row });
    });
});

// Endpoint per eliminare un utente (solo admin)
app.delete('/admin/utenti/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;
    
    db.run('DELETE FROM utenti WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Errore nell\'eliminazione dell\'utente:', err);
            return res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        
        res.json({ message: 'Utente eliminato con successo' });
    });
});

// Endpoint per aggiornare un utente (solo admin)
app.put('/admin/utenti/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;
    const { nome, email, preferenze } = req.body;
    
    // Validazione
    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email sono obbligatori' });
    }
    
    db.run(
        'UPDATE utenti SET nome = ?, email = ?, preferenze = ? WHERE id = ?',
        [nome, email, preferenze || '', userId],
        function(err) {
            if (err) {
                console.error('Errore nell\'aggiornamento dell\'utente:', err);
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email già in uso' });
                }
                return res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'utente' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Utente non trovato' });
            }
            
            res.json({ message: 'Utente aggiornato con successo' });
        }
    );
});

// Endpoint per il login amministratore
app.post('/admin/login', (req, res) => {
    const { username, password, securityCode } = req.body;
    
    // Verifica le credenziali dell'amministratore
    if (username === 'admin' && password === 'Admin123!' && securityCode === 'UniFinder2024') {
        // Crea una sessione per l'admin
        req.session.user = {
            id: 0, // ID speciale per admin
            nome: 'Amministratore',
            email: 'admin',
            isAdmin: true
        };
        
        res.json({ 
            message: 'Login amministratore effettuato con successo',
            user: {
                nome: 'Amministratore',
                email: 'admin'
            }
        });
    } else {
        res.status(401).json({ error: 'Credenziali amministratore non valide' });
    }
});



app.get('/admin/test', (req, res) => {
    res.json({ message: 'Test endpoint funzionante', session: req.session });
});

// Endpoint per ottenere statistiche (solo admin)
app.get('/admin/statistiche', requireAdmin, (req, res) => {
    // Ottieni il conteggio degli utenti
    db.get('SELECT COUNT(*) as totalUsers FROM utenti', [], (err, userCount) => {
        if (err) {
            console.error('Errore nel recupero delle statistiche:', err);
            return res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
        }
        
        // Puoi aggiungere altre statistiche qui
        res.json({
            totalUsers: userCount.totalUsers,
            // Altre statistiche...
        });
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
