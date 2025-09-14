// middleware/subdomain.js
const express = require('express');

// Middleware para detectar subdomínios
const subdomainMiddleware = (req, res, next) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];
  
  // Adiciona informações do subdomínio à requisição
  req.subdomain = subdomain;
  req.isApiSubdomain = subdomain === 'api' || subdomain === 'api-cal-app';
  
  next();
};

// Middleware para rotas com prefixo de subdomínio
const apiPrefixMiddleware = (req, res, next) => {
  // Não adiciona prefixo - as rotas funcionam diretamente
  // Este middleware pode ser usado para futuras funcionalidades
  next();
};

module.exports = {
  subdomainMiddleware,
  apiPrefixMiddleware
};
