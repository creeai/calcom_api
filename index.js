// index.js
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const eventTypesRouter = require('./routes/eventTypes');
const db = require('./db');
const { subdomainMiddleware } = require('./middleware/subdomain');
const { redirectMiddleware, redirectInfoMiddleware } = require('./middleware/redirect');

app.use(express.json());

// Middleware para subdomínios (apenas para informações)
app.use(subdomainMiddleware);

// Middleware para redirecionamento de rotas
app.use(redirectMiddleware);
app.use(redirectInfoMiddleware);

// Middleware de debug para ver as rotas
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url} - Host: ${req.get('host')}`);
  next();
});

// Middleware para CORS (necessário para Easy Panel)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Testa conexão com o banco de dados
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const redirectInfo = res.locals.redirectInfo;
  
  res.json({
    message: 'Cal.com API - Sistema de Agendamentos',
    version: '1.0.0',
    host: req.get('host'),
    subdomain: req.subdomain,
    baseUrl: baseUrl,
    customRoutes: redirectInfo.customRoutes,
    endpoints: {
      users: `${baseUrl}${redirectInfo.customRoutes.users}`,
      bookings: `${baseUrl}${redirectInfo.customRoutes.booking}`,
      eventTypes: `${baseUrl}${redirectInfo.customRoutes.eventTypes}`,
      health: `${baseUrl}${redirectInfo.customRoutes.health}`
    },
    examples: {
      getBookings: `GET ${baseUrl}${redirectInfo.customRoutes.booking}/user/1`,
      createBooking: `POST ${baseUrl}${redirectInfo.customRoutes.booking}`,
      getEventTypes: `GET ${baseUrl}${redirectInfo.customRoutes.eventTypes}`,
      getEventTypeById: `GET ${baseUrl}${redirectInfo.customRoutes.eventTypes}/1`,
      getUser: `GET ${baseUrl}${redirectInfo.customRoutes.users}/1`
    },
    environmentVariables: {
      BOOKING_ROUTE: process.env.BOOKING_ROUTE || '/booking',
      EVENT_TYPE_ROUTE: process.env.EVENT_TYPE_ROUTE || '/event-types',
      USER_ROUTE: process.env.USER_ROUTE || '/user',
      HEALTH_ROUTE: process.env.HEALTH_ROUTE || '/health',
      ROOT_ROUTE: process.env.ROOT_ROUTE || '/'
    }
  });
});

// Registrar rotas
app.use('/users', usersRouter);
app.use('/bookings', bookingsRouter);
app.use('/event-types', eventTypesRouter);

// Log das rotas registradas
console.log('✅ Rotas registradas:');
console.log('  - /users');
console.log('  - /bookings');
console.log('  - /event-types');
console.log('  - /health');
console.log('  - /');

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`📊 Health check disponível em http://${HOST}:${PORT}/health`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
