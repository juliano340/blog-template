const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./src/routes');

const app = express();
const port = 3000;

// Configuração do middleware de sessão
app.use(
    session({
      secret: 'sua_chave_secreta',
      resave: false,
      saveUninitialized: false,
    })
  );

// Middleware para tratar as requisições JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Utilizando as rotas definidas em routes.js
app.use('/', routes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
