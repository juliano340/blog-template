const express = require('express');
const path = require('path');
const { authenticateUser } = require('./controllers/authController');

const router = express.Router();

// Rota de autenticação de usuários
router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'login.html');
  res.sendFile(filePath);
});

// Rota de autenticação de usuários
router.post('/login', authenticateUser);

module.exports = router;

// Rota do dashboard
router.get('/dashboard', (req, res) => {
    // Verificar se o usuário está autenticado
    if (req.session.userId) {
      // Renderizar o dashboard com informações dinâmicas
      res.render('dashboard', { user: { email: 'example@example.com' }, dynamicInfo: 'Dados dinâmicos aqui' });
    } else {
      // Redirecionar para a página de login se o usuário não estiver autenticado
      res.redirect('/login');
    }
  });