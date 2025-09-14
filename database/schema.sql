-- Schema do banco de dados para Cal.com API
-- Execute este script no seu banco PostgreSQL

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tipos de Eventos
CREATE TABLE IF NOT EXISTS "EventType" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  length INTEGER,
  description TEXT,
  hidden BOOLEAN DEFAULT false,
  userId INTEGER REFERENCES "User"(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS "Booking" (
  uid UUID PRIMARY KEY,
  userId INTEGER REFERENCES "User"(id),
  eventTypeId INTEGER REFERENCES "EventType"(id),
  startTime TIMESTAMP,
  endTime TIMESTAMP,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_booking_user_id ON "Booking"("userId");
CREATE INDEX IF NOT EXISTS idx_booking_event_type_id ON "Booking"("eventTypeId");
CREATE INDEX IF NOT EXISTS idx_booking_start_time ON "Booking"("startTime");
CREATE INDEX IF NOT EXISTS idx_event_type_user_id ON "EventType"("userId");
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"("email");

-- Dados de exemplo (opcional)
INSERT INTO "User" (name, email) VALUES 
('João Silva', 'joao@exemplo.com'),
('Maria Santos', 'maria@exemplo.com'),
('Pedro Oliveira', 'pedro@exemplo.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "EventType" (title, slug, length, description, hidden, userId) VALUES 
('Consulta Médica', 'consulta-medica', 30, 'Consulta médica de 30 minutos', false, 1),
('Reunião de Trabalho', 'reuniao-trabalho', 60, 'Reunião de trabalho de 1 hora', false, 1),
('Aula Particular', 'aula-particular', 45, 'Aula particular de 45 minutos', false, 2)
ON CONFLICT (slug) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_type_updated_at BEFORE UPDATE ON "EventType" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_updated_at BEFORE UPDATE ON "Booking" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
