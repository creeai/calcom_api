// routes/schedules.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os schedules (com filtros e paginação)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      userId,
      name,
      timeZone,
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    // Construir query base
    let query = 'SELECT * FROM "Schedule"';
    let conditions = [];
    let params = [];
    let paramCount = 0;

    // Adicionar filtros
    if (userId) {
      paramCount++;
      conditions.push(`"userId" = $${paramCount}`);
      params.push(parseInt(userId));
    }

    if (name) {
      paramCount++;
      conditions.push(`"name" ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }

    if (timeZone) {
      paramCount++;
      conditions.push(`"timeZone" = $${paramCount}`);
      params.push(timeZone);
    }

    // Adicionar condições WHERE se existirem
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Adicionar ordenação
    const validSortColumns = ['id', 'userId', 'name', 'timeZone', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY "${sortColumn}" ${order}`;

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
    let countQuery = 'SELECT COUNT(*) FROM "Schedule"';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await db.query(countQuery, params.slice(0, -2)); // Remove LIMIT e OFFSET params
    const total = parseInt(countResult.rows[0].count);

    res.json({
      schedules: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        userId: userId || null,
        name: name || null,
        timeZone: timeZone || null,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Erro ao buscar schedules:', err);
    res.status(500).json({ error: 'Erro ao buscar schedules' });
  }
});

// Obter schedules de um usuário específico
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, timeZone } = req.query;
  
  try {
    let query = 'SELECT * FROM "Schedule" WHERE "userId" = $1';
    let params = [userId];
    let paramCount = 1;

    if (name) {
      paramCount++;
      query += ` AND "name" ILIKE $${paramCount}`;
      params.push(`%${name}%`);
    }

    if (timeZone) {
      paramCount++;
      query += ` AND "timeZone" = $${paramCount}`;
      params.push(timeZone);
    }

    query += ' ORDER BY "name" ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar schedules do usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar schedules do usuário' });
  }
});

// Obter um schedule específico por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "Schedule" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar schedule:', err);
    res.status(500).json({ error: 'Erro ao buscar schedule' });
  }
});

// Criar novo schedule
router.post('/', async (req, res) => {
  const { userId, name, timeZone, availability } = req.body;
  
  if (!userId || !name || !timeZone) {
    return res.status(400).json({ 
      error: 'userId, name e timeZone são obrigatórios' 
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO "Schedule" ("userId", "name", "timeZone", "availability")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, name, timeZone, availability]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar schedule:', err);
    res.status(500).json({ error: 'Erro ao criar schedule' });
  }
});

// Atualizar schedule existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, timeZone, availability } = req.body;

  try {
    const result = await db.query(
      `UPDATE "Schedule"
       SET "name" = $1, "timeZone" = $2, "availability" = $3, "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, timeZone, availability, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar schedule:', err);
    res.status(500).json({ error: 'Erro ao atualizar schedule' });
  }
});

// Deletar schedule
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "Schedule" WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule não encontrado' });
    }
    res.json({ message: 'Schedule deletado com sucesso', schedule: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar schedule:', err);
    res.status(500).json({ error: 'Erro ao deletar schedule' });
  }
});

// Obter disponibilidade de um schedule
router.get('/:id/availability', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "Schedule" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule não encontrado' });
    }
    
    const schedule = result.rows[0];
    res.json({
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      timeZone: schedule.timeZone,
      availability: schedule.availability
    });
  } catch (err) {
    console.error('Erro ao buscar disponibilidade do schedule:', err);
    res.status(500).json({ error: 'Erro ao buscar disponibilidade do schedule' });
  }
});

// Atualizar disponibilidade de um schedule
router.put('/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  if (!availability) {
    return res.status(400).json({ error: 'availability é obrigatório' });
  }

  try {
    const result = await db.query(
      `UPDATE "Schedule"
       SET "availability" = $1, "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [availability, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar disponibilidade do schedule:', err);
    res.status(500).json({ error: 'Erro ao atualizar disponibilidade do schedule' });
  }
});

module.exports = router;
