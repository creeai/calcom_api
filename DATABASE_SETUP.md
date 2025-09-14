# 🗄️ Setup do Banco de Dados

## 🚨 Problema Identificado

O erro `relation "User" does not exist` indica que as tabelas não foram criadas no banco de dados PostgreSQL.

## 🔧 Solução - Endpoints de Setup

### **1. Verificar Status do Banco**
```bash
GET /setup/database-status
```

**Exemplo:**
```bash
curl https://meudominio.com/setup/database-status
```

**Resposta:**
```json
{
  "database": "connected",
  "tables": {
    "User": {
      "exists": false,
      "error": "relation \"User\" does not exist"
    },
    "EventType": {
      "exists": false,
      "error": "relation \"EventType\" does not exist"
    },
    "Booking": {
      "exists": false,
      "error": "relation \"Booking\" does not exist"
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **2. Inicializar Banco de Dados**
```bash
POST /setup/init-database
```

**Exemplo:**
```bash
curl -X POST https://meudominio.com/setup/init-database
```

**Resposta:**
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso!",
  "tables": ["User", "EventType", "Booking"],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **3. Criar Dados de Exemplo (Opcional)**
```bash
POST /setup/seed-data
```

**Exemplo:**
```bash
curl -X POST https://meudominio.com/setup/seed-data
```

**Resposta:**
```json
{
  "success": true,
  "message": "Dados de exemplo criados com sucesso!",
  "data": {
    "users": 3,
    "eventTypes": 3,
    "bookings": 2
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 📋 Passos para Resolver

### **Passo 1: Verificar Status**
```bash
curl https://meudominio.com/setup/database-status
```

### **Passo 2: Inicializar Banco**
```bash
curl -X POST https://meudominio.com/setup/init-database
```

### **Passo 3: Criar Dados de Exemplo**
```bash
curl -X POST https://meudominio.com/setup/seed-data
```

### **Passo 4: Testar Usuários**
```bash
curl https://meudominio.com/user
```

## 🗂️ Estrutura das Tabelas

### **Tabela User**
```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabela EventType**
```sql
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
```

### **Tabela Booking**
```sql
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
```

## 🔍 Verificação Manual

### **Se você tem acesso direto ao banco PostgreSQL:**

1. **Conecte ao banco:**
```bash
psql -h host -U usuario -d database
```

2. **Execute o schema:**
```sql
-- Copie e cole o conteúdo do arquivo database/schema.sql
```

3. **Verifique as tabelas:**
```sql
\dt
```

4. **Verifique os dados:**
```sql
SELECT * FROM "User";
SELECT * FROM "EventType";
SELECT * FROM "Booking";
```

## 🚀 Script SQL Completo

O arquivo `database/schema.sql` contém:

- ✅ Criação de todas as tabelas
- ✅ Índices para performance
- ✅ Dados de exemplo
- ✅ Triggers para updated_at
- ✅ Constraints e relacionamentos

## ⚠️ Importante

### **Execute APENAS UMA VEZ:**
- O endpoint `/setup/init-database` pode ser executado múltiplas vezes
- Usa `CREATE TABLE IF NOT EXISTS` para evitar erros
- Dados de exemplo são inseridos apenas se não existirem

### **Backup Recomendado:**
- Faça backup do banco antes de executar
- Os dados existentes serão preservados

## 🎯 Após o Setup

### **Teste os Endpoints:**
```bash
# Listar usuários
curl https://meudominio.com/user

# Buscar usuário por email
curl https://meudominio.com/user/email/joao@exemplo.com

# Listar tipos de eventos
curl https://meudominio.com/event-types

# Listar agendamentos
curl https://meudominio.com/booking/user/1
```

### **Dados de Exemplo Criados:**
- **3 usuários**: João Silva, Maria Santos, Pedro Oliveira
- **3 tipos de eventos**: Consulta Médica, Reunião de Trabalho, Aula Particular
- **2 agendamentos**: Consulta e Reunião de exemplo

## 🔧 Troubleshooting

### **Erro: "relation does not exist"**
- ✅ Execute `/setup/init-database`
- ✅ Verifique se a `DATABASE_URL` está correta
- ✅ Confirme se o banco está acessível

### **Erro: "permission denied"**
- ✅ Verifique as permissões do usuário do banco
- ✅ Confirme se o usuário pode criar tabelas

### **Erro: "connection refused"**
- ✅ Verifique se o banco está rodando
- ✅ Confirme se a `DATABASE_URL` está correta
- ✅ Verifique firewall e rede

**Execute o setup e suas rotas de usuários funcionarão perfeitamente! 🚀**
