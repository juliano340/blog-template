// controller.js

const db = require('../db');
const slugify = require('slugify');

// Função para criar um novo post
const criarPost = async (req, res) => {
  const { title, content } = req.body;

  // Verifica se title e content foram fornecidos no corpo da requisição
  if (!title || !content) {
    return res.status(400).json({ error: 'Title e Content são campos obrigatórios.' });
  }

  const slug = slugify(title, { lower: true }); // Gera o slug a partir do título

  try {
    const connection = await db.createConnection();

    // Cria uma nova postagem no banco de dados usando connection.query
    connection.query(
      'INSERT INTO posts (title, content, slug) VALUES (?, ?, ?)',
      [title, content, slug],
      (error, result) => {
        connection.end(); // Fecha a conexão após a consulta

        if (error) {
          console.error('Erro ao criar post:', error);
          res.status(500).json({ error: 'Erro interno ao criar post.' });
        } else {
          console.log('Post criado com sucesso:', result);
          res.status(201).json({ message: 'Post criado com sucesso', postId: result.insertId });
        }
      }
    );
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno ao criar post.' });
  }
};

module.exports = { criarPost };
