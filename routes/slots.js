// routes/slots.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todos os slots disponíveis entre um período
router.get('/', async (req, res) => {
  try {
    const { 
      startTime, 
      endTime, 
      userId, 
      eventTypeId,
      timeZone = 'UTC'
    } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: 'startTime e endTime são obrigatórios' 
      });
    }

    // Validar formato das datas
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Formato de data inválido. Use ISO 8601 (ex: 2024-01-15T10:00:00Z)' 
      });
    }

    if (start >= end) {
      return res.status(400).json({ 
        error: 'startTime deve ser anterior a endTime' 
      });
    }

    let query = `
      SELECT DISTINCT
        s.id as schedule_id,
        s.name as schedule_name,
        s."timeZone" as schedule_timezone,
        a.id as availability_id,
        a."startTime",
        a."endTime",
        a."days"
      FROM "Schedule" s
      LEFT JOIN "Availability" a ON s.id = a."scheduleId"
      WHERE a."startTime" <= $1 
      AND a."endTime" >= $2
    `;
    
    let params = [end, start];
    let paramCount = 2;

    // Adicionar filtros opcionais
    if (userId) {
      paramCount++;
      query += ` AND s."userId" = $${paramCount}`;
      params.push(parseInt(userId));
    }

    if (eventTypeId) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM "EventType" et 
        WHERE et."userId" = s."userId" 
        AND et.id = $${paramCount}
      )`;
      params.push(parseInt(eventTypeId));
    }

    query += ' ORDER BY a."startTime" ASC';

    const result = await db.query(query, params);

    // Processar slots e gerar horários disponíveis
    const slots = [];
    const processedSlots = new Set();

    result.rows.forEach(row => {
      const slotKey = `${row.startTime}_${row.endTime}_${row.schedule_id}`;
      
      if (!processedSlots.has(slotKey)) {
        processedSlots.add(slotKey);
        
        // Gerar slots de 30 minutos dentro do período de disponibilidade
        const availabilityStart = new Date(row.startTime);
        const availabilityEnd = new Date(row.endTime);
        
        let currentSlot = new Date(Math.max(availabilityStart, start));
        
        while (currentSlot < availabilityEnd && currentSlot < end) {
          const slotEnd = new Date(currentSlot.getTime() + 30 * 60000); // 30 minutos
          
          if (slotEnd <= availabilityEnd && slotEnd <= end) {
            slots.push({
              startTime: currentSlot.toISOString(),
              endTime: slotEnd.toISOString(),
              duration: 30,
              scheduleId: row.schedule_id,
              scheduleName: row.schedule_name,
              scheduleTimezone: row.schedule_timezone,
              availabilityId: row.availability_id
            });
          }
          
          currentSlot = slotEnd;
        }
      }
    });

    res.json({
      slots,
      totalSlots: slots.length,
      period: {
        startTime,
        endTime,
        timeZone
      },
      filters: {
        userId: userId || null,
        eventTypeId: eventTypeId || null
      }
    });
  } catch (err) {
    console.error('Erro ao buscar slots:', err);
    res.status(500).json({ error: 'Erro ao buscar slots' });
  }
});

// Obter slots para um usuário específico
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startTime, endTime, eventTypeId, timeZone = 'UTC' } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ 
      error: 'startTime e endTime são obrigatórios' 
    });
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Formato de data inválido' 
      });
    }

    let query = `
      SELECT DISTINCT
        s.id as schedule_id,
        s.name as schedule_name,
        s."timeZone" as schedule_timezone,
        a.id as availability_id,
        a."startTime",
        a."endTime",
        a."days"
      FROM "Schedule" s
      LEFT JOIN "Availability" a ON s.id = a."scheduleId"
      WHERE s."userId" = $1
      AND a."startTime" <= $2 
      AND a."endTime" >= $3
    `;
    
    let params = [userId, end, start];
    let paramCount = 3;

    if (eventTypeId) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM "EventType" et 
        WHERE et."userId" = $1 
        AND et.id = $${paramCount}
      )`;
      params.push(parseInt(eventTypeId));
    }

    query += ' ORDER BY a."startTime" ASC';

    const result = await db.query(query, params);

    // Processar slots
    const slots = [];
    const processedSlots = new Set();

    result.rows.forEach(row => {
      const slotKey = `${row.startTime}_${row.endTime}_${row.schedule_id}`;
      
      if (!processedSlots.has(slotKey)) {
        processedSlots.add(slotKey);
        
        const availabilityStart = new Date(row.startTime);
        const availabilityEnd = new Date(row.endTime);
        
        let currentSlot = new Date(Math.max(availabilityStart, start));
        
        while (currentSlot < availabilityEnd && currentSlot < end) {
          const slotEnd = new Date(currentSlot.getTime() + 30 * 60000);
          
          if (slotEnd <= availabilityEnd && slotEnd <= end) {
            slots.push({
              startTime: currentSlot.toISOString(),
              endTime: slotEnd.toISOString(),
              duration: 30,
              scheduleId: row.schedule_id,
              scheduleName: row.schedule_name,
              scheduleTimezone: row.schedule_timezone,
              availabilityId: row.availability_id
            });
          }
          
          currentSlot = slotEnd;
        }
      }
    });

    res.json({
      userId: parseInt(userId),
      slots,
      totalSlots: slots.length,
      period: {
        startTime,
        endTime,
        timeZone
      },
      filters: {
        eventTypeId: eventTypeId || null
      }
    });
  } catch (err) {
    console.error('Erro ao buscar slots do usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar slots do usuário' });
  }
});

// Obter slots para um tipo de evento específico
router.get('/event-type/:eventTypeId', async (req, res) => {
  const { eventTypeId } = req.params;
  const { startTime, endTime, timeZone = 'UTC' } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ 
      error: 'startTime e endTime são obrigatórios' 
    });
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Formato de data inválido' 
      });
    }

    const query = `
      SELECT DISTINCT
        et.id as event_type_id,
        et.title as event_type_title,
        et.length as event_duration,
        s.id as schedule_id,
        s.name as schedule_name,
        s."timeZone" as schedule_timezone,
        a.id as availability_id,
        a."startTime",
        a."endTime",
        a."days"
      FROM "EventType" et
      JOIN "Schedule" s ON et."userId" = s."userId"
      LEFT JOIN "Availability" a ON s.id = a."scheduleId"
      WHERE et.id = $1
      AND a."startTime" <= $2 
      AND a."endTime" >= $3
      ORDER BY a."startTime" ASC
    `;
    
    const result = await db.query(query, [eventTypeId, end, start]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de evento não encontrado ou sem disponibilidade' });
    }

    // Processar slots baseado na duração do evento
    const eventType = result.rows[0];
    const eventDuration = eventType.event_duration || 30; // minutos
    const slots = [];
    const processedSlots = new Set();

    result.rows.forEach(row => {
      const slotKey = `${row.startTime}_${row.endTime}_${row.schedule_id}`;
      
      if (!processedSlots.has(slotKey)) {
        processedSlots.add(slotKey);
        
        const availabilityStart = new Date(row.startTime);
        const availabilityEnd = new Date(row.endTime);
        
        let currentSlot = new Date(Math.max(availabilityStart, start));
        
        while (currentSlot < availabilityEnd && currentSlot < end) {
          const slotEnd = new Date(currentSlot.getTime() + eventDuration * 60000);
          
          if (slotEnd <= availabilityEnd && slotEnd <= end) {
            slots.push({
              startTime: currentSlot.toISOString(),
              endTime: slotEnd.toISOString(),
              duration: eventDuration,
              eventTypeId: row.event_type_id,
              eventTypeTitle: row.event_type_title,
              scheduleId: row.schedule_id,
              scheduleName: row.schedule_name,
              scheduleTimezone: row.schedule_timezone,
              availabilityId: row.availability_id
            });
          }
          
          currentSlot = slotEnd;
        }
      }
    });

    res.json({
      eventType: {
        id: eventType.event_type_id,
        title: eventType.event_type_title,
        duration: eventDuration
      },
      slots,
      totalSlots: slots.length,
      period: {
        startTime,
        endTime,
        timeZone
      }
    });
  } catch (err) {
    console.error('Erro ao buscar slots do tipo de evento:', err);
    res.status(500).json({ error: 'Erro ao buscar slots do tipo de evento' });
  }
});

module.exports = router;
