// routes/bookings.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Obter todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Booking" ORDER BY "createdAt" DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar agendamentos',
      details: err.message
    });
  }
});

// Verificar estrutura da tabela de bookings
router.get('/debug/table-structure', async (req, res) => {
  try {
    // Verificar se a tabela existe
    const tableExists = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Booking'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      return res.status(404).json({
        success: false,
        error: 'Tabela Booking não existe',
        suggestion: 'Verifique se o banco de dados está configurado corretamente'
      });
    }
    
    // Obter estrutura da tabela
    const structure = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'Booking'
      ORDER BY ordinal_position;
    `);
    
    // Contar registros
    const count = await db.query('SELECT COUNT(*) as total FROM "Booking"');
    
    // Obter alguns registros de exemplo
    const sample = await db.query('SELECT * FROM "Booking" LIMIT 3');
    
    res.json({
      success: true,
      tableExists: true,
      structure: structure.rows,
      totalRecords: parseInt(count.rows[0].total),
      sampleData: sample.rows
    });
  } catch (err) {
    console.error('Erro ao verificar estrutura da tabela:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao verificar estrutura da tabela',
      details: err.message
    });
  }
});

// Obter todos os agendamentos de um usuário
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM "Booking" WHERE "userId" = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// Criar um novo agendamento
router.post('/', async (req, res) => {
  const { userId, eventTypeId, startTime, endTime, title, description } = req.body;
  const uid = uuidv4(); // Gera um UUID único para o agendamento
  try {
    const result = await db.query(
      `INSERT INTO "Booking" ("uid", "userId", "eventTypeId", "startTime", "endTime", "title", "description")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [uid, userId, eventTypeId, startTime, endTime, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// Atualizar um agendamento existente
router.put('/:uid', async (req, res) => {
  const { uid } = req.params;
  const { eventTypeId, startTime, endTime, title, description } = req.body;
  try {
    const result = await db.query(
      `UPDATE "Booking"
       SET "eventTypeId" = $1, "startTime" = $2, "endTime" = $3, "title" = $4, "description" = $5
       WHERE "uid" = $6
       RETURNING *`,
      [eventTypeId, startTime, endTime, title, description, uid]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar agendamento:', err);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// Cancelar (remover) um agendamento
router.delete('/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM "Booking" WHERE "uid" = $1 RETURNING *',
      [uid]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento cancelado com sucesso', booking: result.rows[0] });
  } catch (err) {
    console.error('Erro ao cancelar agendamento:', err);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
});

module.exports = router;
