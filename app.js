const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

// --- 1. CONFIGURAÇÃO CORS ---
// Isso diz ao navegador para aceitar requisições de 127.0.0.1
// E permite o envio de cookies (credentials: true)
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    credentials: true,                
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. CONFIGURAÇÃO DE SESSÃO ---
app.use(session({
    secret: 'sua-chave-secreta', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { 
        secure: false,   
        httpOnly: true,  
        sameSite: 'none' 
    }
}));

app.use(express.json());

const PORT = 3000;

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "locadora"
});


app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

app.post('/cadastrar', async (req, res) => {
    const { login, senha, nivel_acesso, telefone, endereco } = req.body;

    if (!login || !senha || !nivel_acesso || !telefone || !endereco) {
        return res.status(400).json({ error: true, mensagem: "Dados incompletos!" });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);
        const dados = { login, senha: hash, nivel_acesso, telefone, endereco };

        conexao.query('INSERT INTO usuarios SET ?', dados, (erro) => {
            if (erro) {
                console.error("ERRO MYSQL:", erro);
                return res.status(500).json({ error: true, mensagem: "Erro ao cadastrar usuário!" });
            }
            res.status(201).json({ success: true, mensagem: "Usuário cadastrado com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ error: true, mensagem: "Erro interno no servidor." });
    }
});

app.post('/login', (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json({ error: true, mensagem: "Dados incompletos!" });
    }

    conexao.query('SELECT * FROM usuarios WHERE login = ?', [login], async (erro, resultado) => {
        if (erro) return res.status(500).json({ error: true, mensagem: "Erro no servidor" });
        if (resultado.length === 0) return res.status(401).json({ error: true, mensagem: "Usuário não encontrado" });

        const usuario = resultado[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) return res.status(401).json({ error: true, mensagem: "Senha incorreta" });

        req.session.usuarioId = usuario.id;
        req.session.login = usuario.login;
        req.session.nivel = usuario.nivel_acesso;

        console.log("SESSÃO CRIADA:", req.session);

        res.json({
            success: true,
            mensagem: "Login realizado com sucesso!",
            nivel: usuario.nivel_acesso
        });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false });
        res.clearCookie('connect.sid');
        res.json({ success: true, mensagem: "Logout realizado com sucesso!" });
    });
});

app.get('/dados-admin', (req, res) => {
    console.log("SESSION NO BACKEND:", req.session);
    
    if (!req.session.usuarioId) {
        return res.status(401).json({ logado: false, mensagem: "Não autorizado" });
    }

    res.json({ 
        logado: true,
        login: req.session.login,
        nivel: req.session.nivel
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});