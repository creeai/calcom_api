-- Script de inicialização do banco de dados para Cal.com API
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Comentário sobre o banco
COMMENT ON DATABASE calcom_pdv IS 'Banco de dados para Cal.com API - Sistema de Agendamentos';

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados Cal.com API inicializado com sucesso!';
    RAISE NOTICE 'Timezone configurado para: %', current_setting('timezone');
    RAISE NOTICE 'Extensões instaladas: uuid-ossp, pg_trgm';
END $$;
