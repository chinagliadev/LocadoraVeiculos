const express = require('express')
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const { error } = require('node:console');
const PORT = 3000

app.use(cors())
app.use(express.json())

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "locadora_veiculos"
})

app.get('/', (req, res) => {
    res.send('index.html')
})

// app.post('/reservar', (req, res)=>{

//     const dados = req.body

//     conexao.query('INSERT INTO agendamentos SET ?', [dados], (error, resultado)=>{
//         if(error) throw error

//         res.sendStatus(200)
//     })

// })

app.post('/cadastrar', (req, res) => {
    const dados = req.body;
    console.log(dados)

    if (!dados.login || !dados.senha || !dados.nivel_acesso || !dados.telefone || !dados.endereco) {
        return res.status(400).json({ error: true, mensagem: "Dados incompletos!" });
    }

    conexao.query('INSERT INTO usuarios SET ?', [dados], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ error: true, mensagem: "Erro ao cadastrar usuário!" });
        }
        res.status(201).json({ success: true, mensagem: "Usuário cadastrado com sucesso!" });
    });
});

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`)
})