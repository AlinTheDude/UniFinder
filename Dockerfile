# Usa un'immagine leggera con Node.js
FROM node:18-alpine

# Crea una directory per l'app
WORKDIR /app

# Copia solo i file di definizione delle dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto (incluso server.js, public, ecc.)
COPY . .

# Espone la porta 3001
EXPOSE 3001

# Comando per avviare il server
CMD ["node", "server.js"]
