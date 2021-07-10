const { Client } = require('pg');


// REMPLIR ICI LES INFORMATIONS POUR LA CONNECTION A LA BASE DE DONNEES

const connection = {
  host: 'localhost',
  database: 'postgres',
  user: 'postgres',
  password: 'root',
};


module.exports = connection;