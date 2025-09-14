// routes/eventTypes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os tipos de eventos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "EventType"');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar tipos de eventos:', err);
    res.status(500).json({ error: 'Erro ao buscar tipos de eventos' });
  }
});

// Obter um tipo de evento específico pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "EventType" WHERE "id" = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de evento não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar tipo de evento:', err);
    res.status(500).json({ error: 'Erro ao buscar tipo de evento' });
  }
});

// Criar um novo tipo de evento
router.post('/', async (req, res) => {
  const { title, slug, length, description, hidden, userId } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO "EventType" ("title", "slug", "length", "description", "hidden", "userId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, slug, length, description, hidden, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar tipo de evento:', err);
    res.status(500).json({ error: 'Erro ao criar tipo de evento' });
  }
});

// Atualizar um tipo de evento existente pelo ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, slug, length, description, hidden } = req.body;
  try {
    const result = await db.query(
      `UPDATE "EventType"
       SET "title" = $1, "slug" = $2, "length" = $3, "description" = $4, "hidden" = $5
       WHERE "id" = $6
       RETURNING *`,
      [title, slug, length, description, hidden, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tipo de evento não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar tipo de evento:', err);
    res.status(500).json({ error: 'Erro ao atualizar tipo de evento' });
  }
});

// Deletar um tipo de evento pelo ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "EventType" WHERE "id" = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tipo de evento não encontrado' });
    }
    res.json({ message: 'Tipo de evento deletado com sucesso', eventType: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar tipo de evento:', err);
    res.status(500).json({ error: 'Erro ao deletar tipo de evento' });
  }
});

module.exports = router;
