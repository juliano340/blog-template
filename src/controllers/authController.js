const { createConnection } = require('../db');
const bcrypt = require('bcrypt');

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
    const { email, senha } = req.body;

    try {

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);


        // Criar uma nova conexão com o banco de dados usando a função do arquivo db.js
        const connection = createConnection();

        // Inserir usuário com senha hash no banco de dados
        connection.query(
            'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
            [email, hashedPassword],
            (error, results, fields) => {
                // Fechar a conexão com o banco de dados
                connection.end();

                if (error) {
                    console.error('Erro na consulta SQL:', error);
                    return res.status(500).json({ error: 'Erro no servidor' });
                }

                return res.json({ message: 'Usuário registrado com sucesso!' });
            }
        );
    } catch (error) {
        console.error('Erro ao criar hash de senha:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Função para autenticar o usuário
const authenticateUser = async (req, res) => {
    const { email, senha } = req.body;


    // Criar uma nova conexão com o banco de dados usando a função do arquivo db.js
    const connection = createConnection();

    // Consultar o banco de dados para obter a senha hash
    connection.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (error, results, fields) => {
            // Fechar a conexão com o banco de dados
            connection.end();

            if (error) {
                console.error('Erro na consulta SQL:', error);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const storedHashedPassword = results[0].senha;

            try {
                // Comparar a senha fornecida com o hash armazenado no banco de dados
                const match = await bcrypt.compare(senha, storedHashedPassword);

                if (match) {
                    req.session.userId = results[0].id;
                    // Log das informações da sessão
                    console.log('Sessão criada com sucesso:');
                    console.log(req.session);
                    return res.json({ message: 'Usuário autenticado com sucesso!' });
                } else {
                    return res.status(401).json({ error: 'Credenciais inválidas' });
                }
            } catch (error) {
                console.error('Erro ao comparar hashes de senha:', error);
                return res.status(500).json({ error: 'Erro no servidor' });
            }
        }
    );
};

module.exports = { registerUser, authenticateUser };
