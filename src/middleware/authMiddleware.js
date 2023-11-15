// middleware/authMiddleware.js

const authenticateMiddleware = (req, res, next) => {
    // Verificar se o usuário está autenticado
    if (req.session.userId) {
      // Se autenticado, continue para a próxima rota
      next();
    } else {
      // Caso contrário, redirecione para a página de login
      if (req.path === '/login') {
        // Se a rota já é /login, permita o acesso
        next();
      } else {
        // Caso contrário, redirecione para a página de login
        res.redirect('/login');
      }
    }
  };
  
  module.exports = { authenticateMiddleware };
  