// routes.js

const express = require('express');
const path = require('path');
const { authenticateUser } = require('./controllers/authController');
const { authenticateMiddleware } = require('./middleware/authMiddleware');

const router = express.Router();

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
  res.render('dashboard', { user: { email: 'example@example.com' }, dynamicInfo: 'Dados dinâmicos aqui' });
});

// Rota de autenticação de usuários
router.post('/login', authenticateUser);

module.exports = router;
