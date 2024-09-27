const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/login', (req,res) => {
    const {username, password} = req.body;
    const user = {
        username: "admin",
        password: "admin"
    };
    console.log(username)
    console.log(password)
    if (username == user.username && password == user.password) {
        res.status(200).json({
            "user": "admin",
            "password": "admin",
            "ruolo": "admin"

        });
    } else {
        res.status(401).json({message: 'Credenziali non valide'});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta  ${PORT}`);
});