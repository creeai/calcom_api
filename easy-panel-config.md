# Configuração para Easy Panel

## 📋 Passos para Deploy no Easy Panel

### 1. Preparação do Repositório
- ✅ Código commitado no GitHub
- ✅ Dockerfile configurado
- ✅ Variáveis de ambiente documentadas
- ✅ Health check implementado

### 2. Configuração no Easy Panel

#### Opção A: Docker Compose (Recomendado)
1. **Crie um novo projeto** no Easy Panel
2. **Selecione "Docker Compose"**
3. **Cole o conteúdo do `docker-compose.prod.yml`**
4. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://usuario:senha@host:porta/database
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   ```

#### Opção B: Dockerfile Direto
1. **Crie um novo projeto** no Easy Panel
2. **Selecione "Dockerfile"**
3. **Configure o repositório GitHub**
4. **Configure as variáveis de ambiente** (mesmas da Opção A)

### 3. Configurações Importantes

#### Variáveis de Ambiente Obrigatórias
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

#### Porta e Domínio
- **Porta interna**: 3000
- **Porta externa**: 3000 (ou a que preferir)
- **Domínio**: Configure conforme necessário

#### Health Check
- **URL**: `http://seu-dominio:porta/health`
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos

### 4. Banco de Dados

#### Opção 1: Banco Externo
- Use um serviço como Supabase, Railway, ou AWS RDS
- Configure a `DATABASE_URL` com as credenciais

#### Opção 2: Banco no Easy Panel
- Crie um serviço PostgreSQL separado
- Use o nome do serviço como host na `DATABASE_URL`

### 5. Scripts SQL para Criação das Tabelas

Execute estes scripts no seu banco PostgreSQL:

```sql
-- Tabela de Usuários
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tipos de Eventos
CREATE TABLE "EventType" (
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
CREATE TABLE "Booking" (
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
CREATE INDEX idx_booking_user_id ON "Booking"("userId");
CREATE INDEX idx_booking_event_type_id ON "Booking"("eventTypeId");
CREATE INDEX idx_booking_start_time ON "Booking"("startTime");
CREATE INDEX idx_event_type_user_id ON "EventType"("userId");
```

### 6. Verificação do Deploy

Após o deploy, verifique:

1. **Health Check**: `GET /health`
   ```bash
   curl http://seu-dominio:porta/health
   ```

2. **API Root**: `GET /`
   ```bash
   curl http://seu-dominio:porta/
   ```

3. **Logs**: Verifique os logs no Easy Panel para erros

### 7. Troubleshooting

#### Problemas Comuns

**Erro de Conexão com Banco**
- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco está acessível
- Verifique se as tabelas foram criadas

**Erro de Porta**
- Confirme se a porta 3000 está liberada
- Verifique se não há conflito de portas

**Erro de CORS**
- O middleware CORS já está configurado
- Se necessário, ajuste as origens permitidas

### 8. Monitoramento

#### Logs Importantes
- Conexão com banco de dados
- Erros de API
- Health check status

#### Métricas Recomendadas
- Uptime da aplicação
- Tempo de resposta da API
- Status do banco de dados

### 9. Backup e Segurança

#### Backup
- Configure backup automático do banco de dados
- Mantenha backup do código no GitHub

#### Segurança
- Use HTTPS em produção
- Configure firewall adequadamente
- Mantenha dependências atualizadas
- Use variáveis de ambiente para dados sensíveis
