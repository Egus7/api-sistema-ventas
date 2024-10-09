const express = require('express');
const bodyParse = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();
const routes = require('./routes'); 

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hola mundo esta una API Backend de Sistema Ventas");
});

// Usar el archivo index.js de /routes para manejar todas las rutas
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: http://localhost:${PORT}`);
});
