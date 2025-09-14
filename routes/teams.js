// routes/teams.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os teams (com filtros e paginação)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      name,
      slug,
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    // Construir query base
    let query = 'SELECT * FROM "Team"';
    let conditions = [];
    let params = [];
    let paramCount = 0;

    // Adicionar filtros
    if (name) {
      paramCount++;
      conditions.push(`"name" ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }

    if (slug) {
      paramCount++;
      conditions.push(`"slug" = $${paramCount}`);
      params.push(slug);
    }

    // Adicionar condições WHERE se existirem
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Adicionar ordenação
    const validSortColumns = ['id', 'name', 'slug', 'created_at', 'updated_at'];
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
    let countQuery = 'SELECT COUNT(*) FROM "Team"';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await db.query(countQuery, params.slice(0, -2)); // Remove LIMIT e OFFSET params
    const total = parseInt(countResult.rows[0].count);

    res.json({
      teams: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        name: name || null,
        slug: slug || null,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Erro ao buscar teams:', err);
    res.status(500).json({ error: 'Erro ao buscar teams' });
  }
});

// Obter um team específico por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "Team" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar team:', err);
    res.status(500).json({ error: 'Erro ao buscar team' });
  }
});

// Obter team por slug
router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await db.query('SELECT * FROM "Team" WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar team por slug:', err);
    res.status(500).json({ error: 'Erro ao buscar team por slug' });
  }
});

// Criar novo team
router.post('/', async (req, res) => {
  const { name, slug, logo, bio, hideBranding, isPrivate, metadata } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ 
      error: 'name e slug são obrigatórios' 
    });
  }

  try {
    // Verificar se slug já existe
    const existingTeam = await db.query('SELECT id FROM "Team" WHERE slug = $1', [slug]);
    if (existingTeam.rows.length > 0) {
      return res.status(409).json({ error: 'Slug já existe' });
    }

    const result = await db.query(
      `INSERT INTO "Team" ("name", "slug", "logo", "bio", "hideBranding", "isPrivate", "metadata")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, logo, bio, hideBranding || false, isPrivate || false, metadata]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar team:', err);
    res.status(500).json({ error: 'Erro ao criar team' });
  }
});

// Atualizar team existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, slug, logo, bio, hideBranding, isPrivate, metadata } = req.body;

  try {
    // Verificar se slug já existe em outro team
    if (slug) {
      const existingTeam = await db.query('SELECT id FROM "Team" WHERE slug = $1 AND id != $2', [slug, id]);
      if (existingTeam.rows.length > 0) {
        return res.status(409).json({ error: 'Slug já existe' });
      }
    }

    const result = await db.query(
      `UPDATE "Team"
       SET "name" = COALESCE($1, "name"),
           "slug" = COALESCE($2, "slug"),
           "logo" = COALESCE($3, "logo"),
           "bio" = COALESCE($4, "bio"),
           "hideBranding" = COALESCE($5, "hideBranding"),
           "isPrivate" = COALESCE($6, "isPrivate"),
           "metadata" = COALESCE($7, "metadata"),
           "updated_at" = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, slug, logo, bio, hideBranding, isPrivate, metadata, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar team:', err);
    res.status(500).json({ error: 'Erro ao atualizar team' });
  }
});

// Deletar team
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "Team" WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }
    res.json({ message: 'Team deletado com sucesso', team: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar team:', err);
    res.status(500).json({ error: 'Erro ao deletar team' });
  }
});

// Obter membros de um team
router.get('/:id/members', async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, role } = req.query;
  
  try {
    // Verificar se team existe
    const teamResult = await db.query('SELECT id, name FROM "Team" WHERE id = $1', [id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }

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
        u.username as user_username
      FROM "Membership" m
      JOIN "users" u ON m."userId" = u.id
      WHERE m."teamId" = $1
    `;
    
    let params = [id];
    let paramCount = 1;

    if (role) {
      paramCount++;
      query += ` AND m.role = $${paramCount}`;
      params.push(role);
    }

    query += ' ORDER BY m."created_at" ASC';

    // Adicionar paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await db.query(query, params);

    // Contar total de membros
    let countQuery = 'SELECT COUNT(*) FROM "Membership" WHERE "teamId" = $1';
    let countParams = [id];
    if (role) {
      countQuery += ' AND role = $2';
      countParams.push(role);
    }
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      team: teamResult.rows[0],
      members: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        role: role || null
      }
    });
  } catch (err) {
    console.error('Erro ao buscar membros do team:', err);
    res.status(500).json({ error: 'Erro ao buscar membros do team' });
  }
});

// Obter tipos de eventos de um team
router.get('/:id/event-types', async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, active } = req.query;
  
  try {
    // Verificar se team existe
    const teamResult = await db.query('SELECT id, name FROM "Team" WHERE id = $1', [id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }

    let query = `
      SELECT 
        et.id,
        et.title,
        et.slug,
        et.description,
        et.length,
        et."schedulingType",
        et.active,
        et."teamId",
        et."created_at",
        et."updated_at"
      FROM "EventType" et
      WHERE et."teamId" = $1
    `;
    
    let params = [id];
    let paramCount = 1;

    if (active !== undefined) {
      paramCount++;
      query += ` AND et.active = $${paramCount}`;
      params.push(active === 'true');
    }

    query += ' ORDER BY et."created_at" ASC';

    // Adicionar paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await db.query(query, params);

    // Contar total de tipos de eventos
    let countQuery = 'SELECT COUNT(*) FROM "EventType" WHERE "teamId" = $1';
    let countParams = [id];
    if (active !== undefined) {
      countQuery += ' AND active = $2';
      countParams.push(active === 'true');
    }
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      team: teamResult.rows[0],
      eventTypes: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        active: active !== undefined ? active === 'true' : null
      }
    });
  } catch (err) {
    console.error('Erro ao buscar tipos de eventos do team:', err);
    res.status(500).json({ error: 'Erro ao buscar tipos de eventos do team' });
  }
});

module.exports = router;
