// routes/memberships.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os memberships (com filtros e paginação)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      userId,
      teamId,
      role,
      accepted,
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    // Construir query base
    let query = `
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
    `;
    
    let conditions = [];
    let params = [];
    let paramCount = 0;

    // Adicionar filtros
    if (userId) {
      paramCount++;
      conditions.push(`m."userId" = $${paramCount}`);
      params.push(parseInt(userId));
    }

    if (teamId) {
      paramCount++;
      conditions.push(`m."teamId" = $${paramCount}`);
      params.push(parseInt(teamId));
    }

    if (role) {
      paramCount++;
      conditions.push(`m.role = $${paramCount}`);
      params.push(role);
    }

    if (accepted !== undefined) {
      paramCount++;
      conditions.push(`m.accepted = $${paramCount}`);
      params.push(accepted === 'true');
    }

    // Adicionar condições WHERE se existirem
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Adicionar ordenação
    const validSortColumns = ['id', 'userId', 'teamId', 'role', 'accepted', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY m."${sortColumn}" ${order}`;

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
    let countQuery = 'SELECT COUNT(*) FROM "Membership" m';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await db.query(countQuery, params.slice(0, -2)); // Remove LIMIT e OFFSET params
    const total = parseInt(countResult.rows[0].count);

    res.json({
      memberships: result.rows,
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
        teamId: teamId || null,
        role: role || null,
        accepted: accepted !== undefined ? accepted === 'true' : null,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Erro ao buscar memberships:', err);
    res.status(500).json({ error: 'Erro ao buscar memberships' });
  }
});

// Obter um membership específico por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
      WHERE m.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membership não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar membership:', err);
    res.status(500).json({ error: 'Erro ao buscar membership' });
  }
});

// Obter membership por userId e teamId
router.get('/user/:userId/team/:teamId', async (req, res) => {
  const { userId, teamId } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
      WHERE m."userId" = $1 AND m."teamId" = $2
    `, [userId, teamId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membership não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar membership por userId e teamId:', err);
    res.status(500).json({ error: 'Erro ao buscar membership por userId e teamId' });
  }
});

// Criar novo membership
router.post('/', async (req, res) => {
  const { userId, teamId, role = 'MEMBER', accepted = false } = req.body;
  
  if (!userId || !teamId) {
    return res.status(400).json({ 
      error: 'userId e teamId são obrigatórios' 
    });
  }

  try {
    // Verificar se usuário existe
    const userResult = await db.query('SELECT id, name FROM "users" WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se team existe
    const teamResult = await db.query('SELECT id, name FROM "Team" WHERE id = $1', [teamId]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }

    // Verificar se membership já existe
    const existingMembership = await db.query(
      'SELECT id FROM "Membership" WHERE "userId" = $1 AND "teamId" = $2', 
      [userId, teamId]
    );
    if (existingMembership.rows.length > 0) {
      return res.status(409).json({ error: 'Usuário já é membro deste team' });
    }

    // Validar role
    const validRoles = ['OWNER', 'ADMIN', 'MEMBER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role inválido. Use: OWNER, ADMIN ou MEMBER' });
    }

    const result = await db.query(
      `INSERT INTO "Membership" ("userId", "teamId", "role", "accepted")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, teamId, role, accepted]
    );
    
    // Buscar dados completos do membership criado
    const fullResult = await db.query(`
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
      WHERE m.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json(fullResult.rows[0]);
  } catch (err) {
    console.error('Erro ao criar membership:', err);
    res.status(500).json({ error: 'Erro ao criar membership' });
  }
});

// Atualizar membership existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { role, accepted } = req.body;

  try {
    // Validar role se fornecido
    if (role) {
      const validRoles = ['OWNER', 'ADMIN', 'MEMBER'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Role inválido. Use: OWNER, ADMIN ou MEMBER' });
      }
    }

    const result = await db.query(
      `UPDATE "Membership"
       SET "role" = COALESCE($1, "role"),
           "accepted" = COALESCE($2, "accepted"),
           "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [role, accepted, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membership não encontrado' });
    }
    
    // Buscar dados completos do membership atualizado
    const fullResult = await db.query(`
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
      WHERE m.id = $1
    `, [id]);
    
    res.json(fullResult.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar membership:', err);
    res.status(500).json({ error: 'Erro ao atualizar membership' });
  }
});

// Deletar membership
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "Membership" WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membership não encontrado' });
    }
    res.json({ message: 'Membership deletado com sucesso', membership: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar membership:', err);
    res.status(500).json({ error: 'Erro ao deletar membership' });
  }
});

// Aceitar convite de membership
router.patch('/:id/accept', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `UPDATE "Membership"
       SET "accepted" = true, "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $1 AND "accepted" = false
       RETURNING *`,
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membership não encontrado ou já aceito' });
    }
    
    // Buscar dados completos do membership
    const fullResult = await db.query(`
      SELECT 
        m.id,
        m."userId",
        m."teamId",
        m.role,
        m.accepted,
        m."created_at",
        m."updated_at",
        u.name as user_name,
        u.email as user_email,
        u.username as user_username,
        t.name as team_name,
        t.slug as team_slug
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      JOIN "Team" t ON m."teamId" = t.id
      WHERE m.id = $1
    `, [id]);
    
    res.json({
      message: 'Convite aceito com sucesso',
      membership: fullResult.rows[0]
    });
  } catch (err) {
    console.error('Erro ao aceitar membership:', err);
    res.status(500).json({ error: 'Erro ao aceitar membership' });
  }
});

// Rejeitar convite de membership
router.patch('/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `DELETE FROM "Membership"
       WHERE id = $1 AND "accepted" = false
       RETURNING *`,
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membership não encontrado ou já aceito' });
    }
    
    res.json({
      message: 'Convite rejeitado com sucesso',
      membership: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao rejeitar membership:', err);
    res.status(500).json({ error: 'Erro ao rejeitar membership' });
  }
});

module.exports = router;
