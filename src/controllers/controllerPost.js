
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

// controller.js

const db = require('../db');
const slugify = require('slugify');

const listarPost = async (req, res) => {
  try {
    const connection = await db.createConnection();

    connection.query('SELECT * FROM posts', (error, results) => {
      connection.end();

      if (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).send('<p>Erro interno ao buscar posts.</p>');
      } else {
        const postsList = results.map(post => `<li><a href="/posts/${post.slug}">${post.title}</a></li>`).join('');
        const html = `<ul>${postsList}</ul>`;
        res.status(200).send(html);
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).send('<p>Erro interno ao buscar posts.</p>');
  }
};

const visualizarPost = async (req, res) => {
  const { slug } = req.params;

  try {
    const connection = await db.createConnection();

    connection.query('SELECT * FROM posts WHERE slug = ?', [slug], (error, results) => {
      connection.end();

      if (error) {
        console.error('Erro ao buscar post:', error);
        res.status(500).send('<p>Erro interno ao buscar o post.</p>');
      } else if (results.length === 0) {
        res.status(404).send('<p>Post não encontrado.</p>');
      } else {
        const post = results[0];
        const html = `<h1>${post.title}</h1><p>${post.content}</p>`;
        res.status(200).send(html);
      }
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).send('<p>Erro interno ao buscar o post.</p>');
  }
};




module.exports = { criarPost, listarPost, visualizarPost };
