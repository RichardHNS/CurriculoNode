
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(bodyParser.json());

require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Agora você pode usar essas variáveis em sua configuração de banco de dados
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});


// Rota para obter todos os currículos
app.get('/curriculos', (req, res) => {
  pool.query('SELECT * FROM curriculo ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Rota para obter um currículo pelo nome
app.get('/curriculos/pessoa/:nome', (req, res) => {
  const nome = req.params.nome;
  pool.query('SELECT * FROM curriculo WHERE nome = $1', [nome], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Rota para criar um novo currículo
app.post('/curriculos', (req, res) => {
  const { nome, sobrenome, email, telefone, formacao, experiencia } = req.body;
  pool.query(
    'INSERT INTO curriculo (nome, sobrenome, email, telefone, formacao, experiencia) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [nome, sobrenome, email, telefone, formacao, experiencia],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).json({ id: results.rows[0].id });
    }
  );
});

// Rota para atualizar um currículo existente
app.put('/curriculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, sobrenome, email, telefone, formacao, experiencia } = req.body;
  pool.query(
    'UPDATE curriculo SET nome = $1, sobrenome = $2, email = $3, telefone = $4, formacao = $5, experiencia = $6 WHERE id = $7',
    [nome, sobrenome, email, telefone, formacao, experiencia, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Currículo modificado com ID: ${id}`);
    }
  );
});

// Rota para excluir um currículo
app.delete('/curriculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM curriculo WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Currículo excluído com ID: ${id}`);
  });
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}.`);
});


