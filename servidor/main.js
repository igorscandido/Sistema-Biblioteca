const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'biblioteca',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

app.get('/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/categorias', (req, res) => {
  const { nome } = req.body;
  db.query(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nome });
    }
  );
});

app.put('/categorias/:id', (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  db.query(
    'UPDATE categorias SET nome=? WHERE id=?',
    [nome, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nome });
    }
  );
});

app.delete('/categorias/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categorias WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Categoria removida com sucesso!' });
  });
});

app.get('/livros', (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/livros', (req, res) => {
  const { titulo, autor, ano_publicacao, categoria_id, quantidade_disponivel } = req.body;
  db.query(
    'INSERT INTO livros (titulo, autor, ano_publicacao, categoria_id, quantidade_disponivel) VALUES (?, ?, ?, ?, ?)',
    [titulo, autor, ano_publicacao, categoria_id, quantidade_disponivel],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/livros/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano_publicacao, categoria_id, quantidade_disponivel } = req.body;
  db.query(
    'UPDATE livros SET titulo=?, autor=?, ano_publicacao=?, categoria_id=?, quantidade_disponivel=? WHERE id=?',
    [titulo, autor, ano_publicacao, categoria_id, quantidade_disponivel, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...req.body });
    }
  );
});

app.delete('/livros/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM livros WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Livro removido com sucesso!' });
  });
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;
  db.query(
    'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
    [nome, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nome, email });
    }
  );
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  db.query(
    'UPDATE usuarios SET nome=?, email=? WHERE id=?',
    [nome, email, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nome, email });
    }
  );
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuário removido com sucesso!' });
  });
});

app.get('/emprestimos', (req, res) => {
  db.query(
    `SELECT e.*, l.titulo AS livro, u.nome AS usuario FROM emprestimos e
     JOIN livros l ON e.livro_id = l.id
     JOIN usuarios u ON e.usuario_id = u.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post('/emprestimos', (req, res) => {
  const { livro_id, usuario_id, data_emprestimo, data_devolucao, status } = req.body;
  db.query(
    'INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo, data_devolucao, status) VALUES (?, ?, ?, ?, ?)',
    [livro_id, usuario_id, data_emprestimo, data_devolucao, status || 'pendente'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/emprestimos/:id', (req, res) => {
  const { id } = req.params;
  const { livro_id, usuario_id, data_emprestimo, data_devolucao, status } = req.body;
  db.query(
    'UPDATE emprestimos SET livro_id=?, usuario_id=?, data_emprestimo=?, data_devolucao=?, status=? WHERE id=?',
    [livro_id, usuario_id, data_emprestimo, data_devolucao, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...req.body });
    }
  );
});

app.delete('/emprestimos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM emprestimos WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Empréstimo removido com sucesso!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
