const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para tratar as requisições JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do middleware de sessão
app.use(
  session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: false,
  })
);

// Configuração do mecanismo de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Utilizando as rotas definidas em routes.js
app.use('/', routes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
