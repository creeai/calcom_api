// routes/availability.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware de debug para verificar rotas
router.use((req, res, next) => {
  console.log(`🔍 Availability Route: ${req.method} ${req.url} - Params:`, req.params);
  next();
});

// Função para gerar horários disponíveis organizados por dias
function generateWeeklyAvailability() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dates = [];
  
  // Gerar datas para os próximos 7 dias
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = daysOfWeek[date.getDay()];
    const dateString = date.toISOString().split('T')[0];
    
    // Gerar horários baseados no dia da semana
    let hours = [];
    
    if (dayName === 'Monday') {
      // Segunda-feira: horários limitados
      hours = [
        { start: "10:00 BRT", end: "11:00 BRT" },
        { start: "13:00 BRT", end: "14:00 BRT" },
        { start: "14:00 BRT", end: "15:00 BRT" },
        { start: "16:00 BRT", end: "17:00 BRT" },
        { start: "17:00 BRT", end: "18:00 BRT" },
        { start: "18:00 BRT", end: "19:00 BRT" }
      ];
    } else if (dayName === 'Saturday') {
      // Sábado: horários limitados
      hours = [
        { start: "08:00 BRT", end: "09:00 BRT" },
        { start: "09:00 BRT", end: "10:00 BRT" },
        { start: "10:00 BRT", end: "11:00 BRT" },
        { start: "11:00 BRT", end: "12:00 BRT" },
        { start: "12:00 BRT", end: "13:00 BRT" },
        { start: "13:00 BRT", end: "14:00 BRT" },
        { start: "14:00 BRT", end: "15:00 BRT" }
      ];
    } else if (dayName === 'Sunday') {
      // Domingo: sem horários disponíveis
      hours = [];
    } else {
      // Terça a Sexta: horários completos
      hours = [
        { start: "08:00 BRT", end: "09:00 BRT" },
        { start: "09:00 BRT", end: "10:00 BRT" },
        { start: "10:00 BRT", end: "11:00 BRT" },
        { start: "11:00 BRT", end: "12:00 BRT" },
        { start: "12:00 BRT", end: "13:00 BRT" },
        { start: "13:00 BRT", end: "14:00 BRT" },
        { start: "14:00 BRT", end: "15:00 BRT" },
        { start: "15:00 BRT", end: "16:00 BRT" },
        { start: "16:00 BRT", end: "17:00 BRT" },
        { start: "17:00 BRT", end: "18:00 BRT" },
        { start: "18:00 BRT", end: "19:00 BRT" }
      ];
    }
    
    dates.push({
      day: dayName,
      date: dateString,
      hours: hours
    });
  }
  
  return dates;
}

// Obter uma disponibilidade específica por ID (DEVE VIR ANTES DA ROTA GERAL)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  // Verificar se o ID é um número válido
  if (isNaN(id) || !Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'ID deve ser um número inteiro válido' });
  }
  
  try {
    console.log(`🔎 Buscando disponibilidade com ID: ${id}`);
    const query = 'SELECT * FROM "Availability" WHERE id = $1';
    console.log(`📝 Executando query: ${query} com parâmetros: [${id}]`);
    
    const result = await db.query(query, [parseInt(id)]);
    console.log(`📊 Resultado da query:`, result.rows);
    
    if (result.rows.length === 0) {
      console.log(`⚠️ Disponibilidade com ID ${id} não encontrada. Total de registros retornados: ${result.rows.length}`);
      return res.status(404).json({ 
        error: 'Disponibilidade não encontrada',
        id: parseInt(id),
        message: `Nenhum registro encontrado com ID ${id}`
      });
    }
    
    console.log(`✅ Disponibilidade com ID ${id} encontrada:`, result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`❌ Erro ao buscar disponibilidade com ID ${id}:`, err);
    res.status(500).json({ 
      error: 'Erro ao buscar disponibilidade',
      details: err.message,
      id: parseInt(id)
    });
  }
});

// Listar todos os IDs disponíveis na tabela Availability
router.get('/debug/ids', async (req, res) => {
  try {
    console.log('🔍 Listando todos os IDs disponíveis na tabela Availability');
    const result = await db.query('SELECT id, "userId", "scheduleId", "startTime", "endTime", days FROM "Availability" ORDER BY id ASC');
    
    console.log(`📊 Total de registros encontrados: ${result.rows.length}`);
    console.log('📋 IDs disponíveis:', result.rows.map(row => row.id));
    
    res.json({
      success: true,
      totalRecords: result.rows.length,
      availableIds: result.rows.map(row => row.id),
      records: result.rows
    });
  } catch (err) {
    console.error('❌ Erro ao listar IDs de disponibilidade:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar IDs de disponibilidade',
      details: err.message
    });
  }
});

// Obter todas as disponibilidades (com filtros e paginação)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      userId,
      scheduleId,
      date,
      sortBy = 'id', 
      sortOrder = 'ASC',
      format = 'structured' // Novo parâmetro para escolher formato
    } = req.query;

    // Se format=structured, retornar no formato específico solicitado
    if (format === 'structured') {
      const dates = generateWeeklyAvailability();
      
      return res.json([{
        data: {
          dates: dates
        },
        meta: {
          serverTime: new Date().toISOString(),
          statusCode: 200,
          message: "FOUND"
        }
      }]);
    }

    // Formato original (compatibilidade)
    // Construir query base
    let query = 'SELECT * FROM "Availability"';
    let conditions = [];
    let params = [];
    let paramCount = 0;

    // Adicionar filtros
    if (userId) {
      paramCount++;
      conditions.push(`"userId" = $${paramCount}`);
      params.push(parseInt(userId));
    }

    if (scheduleId) {
      paramCount++;
      conditions.push(`"scheduleId" = $${paramCount}`);
      params.push(parseInt(scheduleId));
    }

    if (date) {
      paramCount++;
      conditions.push(`DATE("startTime") = $${paramCount}`);
      params.push(date);
    }

    // Adicionar condições WHERE se existirem
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Adicionar ordenação
    const validSortColumns = ['id', 'userId', 'scheduleId', 'startTime', 'endTime', 'created_at', 'updated_at'];
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
    let countQuery = 'SELECT COUNT(*) FROM "Availability"';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await db.query(countQuery, params.slice(0, -2)); // Remove LIMIT e OFFSET params
    const total = parseInt(countResult.rows[0].count);

    res.json({
      availability: result.rows,
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
        scheduleId: scheduleId || null,
        date: date || null,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Erro ao buscar disponibilidades:', err);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades' });
  }
});

// Obter disponibilidades de um usuário específico
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { date, scheduleId } = req.query;
  
  try {
    let query = 'SELECT * FROM "Availability" WHERE "userId" = $1';
    let params = [userId];
    let paramCount = 1;

    if (date) {
      paramCount++;
      query += ` AND DATE("startTime") = $${paramCount}`;
      params.push(date);
    }

    if (scheduleId) {
      paramCount++;
      query += ` AND "scheduleId" = $${paramCount}`;
      params.push(parseInt(scheduleId));
    }

    query += ' ORDER BY "startTime" ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar disponibilidades do usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades do usuário' });
  }
});

// Obter disponibilidades de um schedule específico
router.get('/schedule/:scheduleId', async (req, res) => {
  const { scheduleId } = req.params;
  const { date } = req.query;
  
  try {
    let query = 'SELECT * FROM "Availability" WHERE "scheduleId" = $1';
    let params = [parseInt(scheduleId)];
    let paramCount = 1;

    if (date) {
      paramCount++;
      query += ` AND DATE("startTime") = $${paramCount}`;
      params.push(date);
    }

    query += ' ORDER BY "startTime" ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar disponibilidades do schedule:', err);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades do schedule' });
  }
});

// Criar nova disponibilidade
router.post('/', async (req, res) => {
  const { userId, scheduleId, startTime, endTime, days } = req.body;
  
  if (!userId || !scheduleId || !startTime || !endTime) {
    return res.status(400).json({ 
      error: 'userId, scheduleId, startTime e endTime são obrigatórios' 
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO "Availability" ("userId", "scheduleId", "startTime", "endTime", "days")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, scheduleId, startTime, endTime, days]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao criar disponibilidade' });
  }
});

// Atualizar disponibilidade existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { scheduleId, startTime, endTime, days } = req.body;

  try {
    const result = await db.query(
      `UPDATE "Availability"
       SET "scheduleId" = $1, "startTime" = $2, "endTime" = $3, "days" = $4, "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [scheduleId, startTime, endTime, days, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao atualizar disponibilidade' });
  }
});

// Deletar disponibilidade
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "Availability" WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada' });
    }
    res.json({ message: 'Disponibilidade deletada com sucesso', availability: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao deletar disponibilidade' });
  }
});

// Verificar disponibilidade em um período específico
router.post('/check', async (req, res) => {
  const { userId, startTime, endTime, date } = req.body;
  
  if (!userId || !startTime || !endTime) {
    return res.status(400).json({ 
      error: 'userId, startTime e endTime são obrigatórios' 
    });
  }

  try {
    let query = `
      SELECT * FROM "Availability" 
      WHERE "userId" = $1 
      AND "startTime" <= $2 
      AND "endTime" >= $3
    `;
    let params = [userId, endTime, startTime];
    let paramCount = 3;

    if (date) {
      paramCount++;
      query += ` AND DATE("startTime") = $${paramCount}`;
      params.push(date);
    }

    query += ' ORDER BY "startTime" ASC';

    const result = await db.query(query, params);
    
    res.json({
      available: result.rows.length > 0,
      availability: result.rows,
      requestedPeriod: {
        startTime,
        endTime,
        date: date || null
      }
    });
  } catch (err) {
    console.error('Erro ao verificar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
  }
});

// Obter horários disponíveis para um usuário em uma data específica
router.get('/user/:userId/available-slots', async (req, res) => {
  const { userId } = req.params;
  const { date, duration = 30 } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Parâmetro date é obrigatório' });
  }

  try {
    const result = await db.query(`
      SELECT 
        "startTime",
        "endTime",
        "days"
      FROM "Availability" 
      WHERE "userId" = $1 
      AND DATE("startTime") = $2
      ORDER BY "startTime" ASC
    `, [userId, date]);

    // Gerar slots de tempo baseado na duração
    const slots = [];
    const durationMinutes = parseInt(duration);

    result.rows.forEach(availability => {
      const start = new Date(availability.startTime);
      const end = new Date(availability.endTime);
      
      let current = new Date(start);
      while (current < end) {
        const slotEnd = new Date(current.getTime() + durationMinutes * 60000);
        if (slotEnd <= end) {
          slots.push({
            startTime: current.toISOString(),
            endTime: slotEnd.toISOString(),
            duration: durationMinutes
          });
        }
        current = slotEnd;
      }
    });

    res.json({
      date,
      userId,
      duration: durationMinutes,
      availableSlots: slots,
      totalSlots: slots.length
    });
  } catch (err) {
    console.error('Erro ao obter slots disponíveis:', err);
    res.status(500).json({ error: 'Erro ao obter slots disponíveis' });
  }
});

module.exports = router;
