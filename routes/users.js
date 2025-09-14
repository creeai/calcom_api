// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os usuários (com paginação e filtros opcionais)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      email, 
      name, 
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    // Construir query base
    let query = 'SELECT * FROM users';
    let conditions = [];
    let params = [];
    let paramCount = 0;

    // Adicionar filtros
    if (email) {
      paramCount++;
      conditions.push(`email ILIKE $${paramCount}`);
      params.push(`%${email}%`);
    }

    if (name) {
      paramCount++;
      conditions.push(`name ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }

    // Adicionar condições WHERE se existirem
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Adicionar ordenação
    const validSortColumns = ['id', 'name', 'email', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${order}`;

    // Adicionar paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    // Executar query
    const result = await db.query(query, params);

    // Contar total de registros para paginação
    let countQuery = 'SELECT COUNT(*) FROM users';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await db.query(countQuery, params.slice(0, -2)); // Remove LIMIT e OFFSET params
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        email: email || null,
        name: name || null,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por email
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário por email:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário por email' });
  }
});

// Obter detalhes de um usuário por ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Criar novo usuário
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  try {
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Email já está em uso' });
    }
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, email, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Email já está em uso' });
    }
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso', user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;
