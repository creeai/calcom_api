// routes/setup.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

// Endpoint para inicializar o banco de dados
router.post('/init-database', async (req, res) => {
  try {
    console.log('🚀 Inicializando banco de dados...');
    
    // Ler o arquivo schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Executar o schema
    await db.query(schema);
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    
    res.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      tables: ['User', 'EventType', 'Booking'],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao inicializar banco de dados',
      details: err.message
    });
  }
});

// Endpoint para verificar status do banco
router.get('/database-status', async (req, res) => {
  try {
    // Verificar se as tabelas existem
    const tables = ['User', 'EventType', 'Booking'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const result = await db.query(`SELECT COUNT(*) FROM "${table}"`);
        tableStatus[table] = {
          exists: true,
          count: parseInt(result.rows[0].count)
        };
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err.message
        };
      }
    }
    
    res.json({
      database: 'connected',
      tables: tableStatus,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao verificar status do banco:', err);
    res.status(500).json({
      database: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para criar dados de exemplo
router.post('/seed-data', async (req, res) => {
  try {
    console.log('🌱 Criando dados de exemplo...');
    
    // Verificar se já existem usuários
    const userCount = await db.query('SELECT COUNT(*) FROM "User"');
    if (parseInt(userCount.rows[0].count) > 0) {
      return res.json({
        success: true,
        message: 'Dados de exemplo já existem',
        timestamp: new Date().toISOString()
      });
    }
    
    // Criar usuários de exemplo
    const users = await db.query(`
      INSERT INTO "User" (name, email) VALUES 
      ('João Silva', 'joao@exemplo.com'),
      ('Maria Santos', 'maria@exemplo.com'),
      ('Pedro Oliveira', 'pedro@exemplo.com')
      RETURNING *
    `);
    
    // Criar tipos de eventos de exemplo
    const eventTypes = await db.query(`
      INSERT INTO "EventType" (title, slug, length, description, hidden, userId) VALUES 
      ('Consulta Médica', 'consulta-medica', 30, 'Consulta médica de 30 minutos', false, $1),
      ('Reunião de Trabalho', 'reuniao-trabalho', 60, 'Reunião de trabalho de 1 hora', false, $1),
      ('Aula Particular', 'aula-particular', 45, 'Aula particular de 45 minutos', false, $2)
      RETURNING *
    `, [users.rows[0].id, users.rows[1].id]);
    
    // Criar agendamentos de exemplo
    const bookings = await db.query(`
      INSERT INTO "Booking" (uid, userId, eventTypeId, startTime, endTime, title, description) VALUES 
      (gen_random_uuid(), $1, $2, '2024-01-15 10:00:00', '2024-01-15 10:30:00', 'Consulta com Dr. Silva', 'Consulta de rotina'),
      (gen_random_uuid(), $3, $4, '2024-01-16 14:00:00', '2024-01-16 15:00:00', 'Reunião de Projeto', 'Discussão sobre novo projeto')
      RETURNING *
    `, [users.rows[0].id, eventTypes.rows[0].id, users.rows[1].id, eventTypes.rows[1].id]);
    
    console.log('✅ Dados de exemplo criados com sucesso!');
    
    res.json({
      success: true,
      message: 'Dados de exemplo criados com sucesso!',
      data: {
        users: users.rows.length,
        eventTypes: eventTypes.rows.length,
        bookings: bookings.rows.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Erro ao criar dados de exemplo:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar dados de exemplo',
      details: err.message
    });
  }
});

module.exports = router;
