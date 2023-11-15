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
