const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

  // Conexión a la base de datos
client.connect()
.then(() => {
  console.log('Conexión exitosa a la base de datos');
})
.catch(err => {
  console.error('Error al conectar a la base de datos', err);
  client.end();
});

module.exports = {client};
  
