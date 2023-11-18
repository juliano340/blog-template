
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
        const postsList = results.map(post => `<script>console.log('${post.slug}');</script><li><a href="/posts/${post.slug}">${post.title}</a></li>`).join('');
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
        res.render('siglePost', { post });
        
      }
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).send('<p>Erro interno ao buscar o post.</p>');
  }
};

const blog = async (req, res) => {

  const postsPerPage = 10; // ou qualquer valor desejado
  const currentPage = req.query.page || 1; 
  const offset = (currentPage - 1) * postsPerPage;

  const query = `SELECT * FROM posts ORDER BY created_at DESC LIMIT ${postsPerPage} OFFSET ${offset}`;
  const countQuery = 'SELECT COUNT(*) AS total_posts FROM posts';

  const connection = await db.createConnection();
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar post:', error);
      res.status(500).send('<p>Erro interno ao buscar o post.</p>');
      return; // Importante adicionar um return para sair da função em caso de erro
    }
  
    connection.query(countQuery, (countError, countResults) => {
      if (countError) {
        console.error('Erro ao contar posts:', countError);
        res.status(500).send('<p>Erro interno ao contar posts.</p>');
        return; // Importante adicionar um return para sair da função em caso de erro
      }
  
      const totalPosts = countResults[0].total_posts;
      const pages = Math.ceil(totalPosts / postsPerPage);
      res.render('blog', { posts: results, currentPage, pages });
    });
  });

}

module.exports = { criarPost, listarPost, visualizarPost, blog };
