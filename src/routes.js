const express = require('express');
const path = require('path');
const { authenticateUser } = require('./controllers/authController');
const { authenticateMiddleware } = require('./middleware/authMiddleware');
const router = express.Router();
const controllerPost = require('./controllers/controllerPost');



// Rota de autenticação de usuários
router.get('/login', authenticateMiddleware, (req, res) => {
  // Se o usuário já está autenticado, redirecione para o dashboard
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    // Caso contrário, exiba a página de login
    const filePath = path.join(__dirname, '..', 'public', 'login.html');
    res.sendFile(filePath);
  }
});

// Rota do dashboard
router.get('/dashboard', authenticateMiddleware, (req, res) => {
  // Renderizar o dashboard com informações dinâmicas
  // res.render('dashboard', { user: { email: 'example@example.com' }, dynamicInfo: 'Dados dinâmicos aqui' });
    res.render('dashboard', { user: { email: req.session.email }, nome: req.session.userName });

});

// Rota de autenticação de usuários
router.post('/login', authenticateUser);

// Rota para destruir a sessão do usuário LOGOUT

router.post('/logout', authenticateMiddleware, (req, res) => {
  // Destruir a sessão do usuário
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    // Redirecionar para a página de login após o logout
    res.redirect('/login');
  });
});

router.get('/posts/create', authenticateMiddleware, (req, res) => {
  res.render('createPost');
})

//Rota que controla o POST do formulário de posts

router.post('/posts/create', authenticateMiddleware, controllerPost.criarPost)

//Rota para listar os posts
router.get('/posts',  controllerPost.listarPost)


// Rota para visualizar um post específico com base no slug
router.get('/posts/:slug', controllerPost.visualizarPost);


// Rota para lidar com páginas não encontradas (404)
router.use((req, res) => {
  res.status(404).send('Página não encontrada <a href="/login">Voltar</a>');
});




module.exports = router;
