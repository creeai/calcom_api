// index.js
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const eventTypesRouter = require('./routes/eventTypes');

app.use(express.json());

app.use('/users', usersRouter);
app.use('/bookings', bookingsRouter);
app.use('/event-types', eventTypesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
