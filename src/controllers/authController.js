const { createConnection } = require('../db');

// Função para autenticar o usuário
const authenticateUser = (req, res) => {
  const { email, senha } = req.body;

  // Criar uma nova conexão com o banco de dados usando a função do arquivo db.js
  const connection = createConnection();

  // Consultar o banco de dados para autenticação
  connection.query(
    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (error, results, fields) => {
      // Fechar a conexão com o banco de dados
      connection.end();

      if (error) {
        console.error('Erro na consulta SQL:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (results.length > 0) {
        return res.json({ message: 'Usuário autenticado com sucesso!' });
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
    }
  );
};

module.exports = { authenticateUser };
