const mysql = require('mysql2');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TESTE',
};

// Função para criar uma conexão com o banco de dados
const createConnection = () => {
  return mysql.createConnection(dbConfig);
};

module.exports = { createConnection };
