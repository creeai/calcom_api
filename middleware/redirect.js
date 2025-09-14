// middleware/redirect.js
const express = require('express');

// Middleware para redirecionamento baseado em variáveis de ambiente
const redirectMiddleware = (req, res, next) => {
  const originalUrl = req.originalUrl;
  const method = req.method;
  
  // Mapeamento de rotas baseado em variáveis de ambiente
  const routeMapping = {
    // Rotas de agendamentos
    [process.env.BOOKING_ROUTE || '/booking']: '/bookings',
    [process.env.BOOKING_ROUTE || '/bookings']: '/bookings',
    
    // Rotas de tipos de eventos
    [process.env.EVENT_TYPE_ROUTE || '/event-types']: '/event-types',
    [process.env.EVENT_TYPE_ROUTE || '/event-Types']: '/event-types',
    [process.env.EVENT_TYPE_ROUTE || '/eventtypes']: '/event-types',
    
    // Rotas de usuários
    [process.env.USER_ROUTE || '/user']: '/users',
    [process.env.USER_ROUTE || '/users']: '/users',
    
    // Rotas de saúde
    [process.env.HEALTH_ROUTE || '/health']: '/health',
    [process.env.HEALTH_ROUTE || '/status']: '/health',
    
    // Rota raiz
    [process.env.ROOT_ROUTE || '/']: '/',
    [process.env.ROOT_ROUTE || '/api']: '/',
  };

  // Função para encontrar a rota correspondente
  const findMatchingRoute = (url) => {
    // Remove query parameters
    const cleanUrl = url.split('?')[0];
    
    // Verifica se a URL exata existe no mapeamento
    if (routeMapping[cleanUrl]) {
      return routeMapping[cleanUrl];
    }
    
    // Verifica se a URL começa com alguma rota mapeada
    for (const [customRoute, realRoute] of Object.entries(routeMapping)) {
      if (cleanUrl.startsWith(customRoute + '/') || cleanUrl === customRoute) {
        // Substitui a rota customizada pela rota real
        const newUrl = cleanUrl.replace(customRoute, realRoute);
        return newUrl;
      }
    }
    
    return null;
  };

  // Encontra a rota correspondente
  const newRoute = findMatchingRoute(originalUrl);
  
  if (newRoute && newRoute !== originalUrl) {
    console.log(`🔄 Redirecionando: ${method} ${originalUrl} -> ${newRoute}`);
    
    // Preserva query parameters
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const finalUrl = queryString ? `${newRoute}?${queryString}` : newRoute;
    
    // Atualiza a URL da requisição
    req.url = finalUrl;
    req.originalUrl = finalUrl;
  }
  
  next();
};

// Middleware para mostrar informações de redirecionamento
const redirectInfoMiddleware = (req, res, next) => {
  // Adiciona informações de redirecionamento à resposta
  res.locals.redirectInfo = {
    originalUrl: req.originalUrl,
    currentUrl: req.url,
    method: req.method,
    host: req.get('host'),
    customRoutes: {
      booking: process.env.BOOKING_ROUTE || '/booking',
      eventTypes: process.env.EVENT_TYPE_ROUTE || '/event-types',
      users: process.env.USER_ROUTE || '/user',
      health: process.env.HEALTH_ROUTE || '/health',
      root: process.env.ROOT_ROUTE || '/'
    }
  };
  
  next();
};

module.exports = {
  redirectMiddleware,
  redirectInfoMiddleware
};
