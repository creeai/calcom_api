// routes/explore.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint para listar todas as tabelas do banco
router.get('/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    res.json({
      success: true,
      tables: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao listar tabelas:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar tabelas',
      details: err.message
    });
  }
});

// Endpoint para ver a estrutura de uma tabela específica
router.get('/table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  
  try {
    // Obter informações das colunas
    const columnsResult = await db.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [tableName]);
    
    // Obter informações de chaves estrangeiras
    const foreignKeysResult = await db.query(`
      SELECT 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = $1
    `, [tableName]);
    
    // Obter informações de chaves primárias
    const primaryKeysResult = await db.query(`
      SELECT 
        kcu.column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY' 
        AND tc.table_name = $1
    `, [tableName]);
    
    // Contar registros na tabela
    const countResult = await db.query(`SELECT COUNT(*) FROM "${tableName}"`);
    
    res.json({
      success: true,
      tableName,
      columns: columnsResult.rows,
      primaryKeys: primaryKeysResult.rows.map(row => row.column_name),
      foreignKeys: foreignKeysResult.rows,
      recordCount: parseInt(countResult.rows[0].count),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Erro ao explorar tabela ${tableName}:`, err);
    res.status(500).json({
      success: false,
      error: `Erro ao explorar tabela ${tableName}`,
      details: err.message
    });
  }
});

// Endpoint para ver uma amostra de dados de uma tabela
router.get('/table/:tableName/sample', async (req, res) => {
  const { tableName } = req.params;
  const { limit = 5 } = req.query;
  
  try {
    const result = await db.query(`SELECT * FROM "${tableName}" LIMIT $1`, [parseInt(limit)]);
    
    res.json({
      success: true,
      tableName,
      sample: result.rows,
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Erro ao obter amostra da tabela ${tableName}:`, err);
    res.status(500).json({
      success: false,
      error: `Erro ao obter amostra da tabela ${tableName}`,
      details: err.message
    });
  }
});

// Endpoint para buscar tabelas relacionadas a usuários
router.get('/search/users', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND (column_name ILIKE '%user%' 
             OR column_name ILIKE '%email%' 
             OR column_name ILIKE '%name%'
             OR table_name ILIKE '%user%')
      ORDER BY table_name, ordinal_position
    `);
    
    res.json({
      success: true,
      userRelatedTables: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao buscar tabelas relacionadas a usuários:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tabelas relacionadas a usuários',
      details: err.message
    });
  }
});

// Endpoint para buscar tabelas relacionadas a eventos/agendamentos
router.get('/search/events', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND (column_name ILIKE '%event%' 
             OR column_name ILIKE '%booking%' 
             OR column_name ILIKE '%schedule%'
             OR column_name ILIKE '%appointment%'
             OR table_name ILIKE '%event%'
             OR table_name ILIKE '%booking%')
      ORDER BY table_name, ordinal_position
    `);
    
    res.json({
      success: true,
      eventRelatedTables: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao buscar tabelas relacionadas a eventos:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tabelas relacionadas a eventos',
      details: err.message
    });
  }
});

// Endpoint para obter informações gerais do banco
router.get('/info', async (req, res) => {
  try {
    // Informações do banco
    const dbInfoResult = await db.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version
    `);
    
    // Contar tabelas
    const tablesCountResult = await db.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.json({
      success: true,
      database: dbInfoResult.rows[0],
      tableCount: parseInt(tablesCountResult.rows[0].table_count),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao obter informações do banco:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter informações do banco',
      details: err.message
    });
  }
});

module.exports = router;
