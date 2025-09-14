# 📚 Documentação da API - Cal.com

## 🌐 Base URL
```
https://seu-dominio.com
```

## 🔑 Autenticação
Atualmente a API não requer autenticação. Para implementar autenticação, adicione headers de autorização conforme necessário.

## 📋 Endpoints Disponíveis

---

## 🏠 **Informações da API**

### **GET** `/`
Retorna informações gerais da API e endpoints disponíveis.

**Resposta:**
```json
{
  "message": "Cal.com API - Sistema de Agendamentos",
  "version": "1.0.0",
  "host": "seu-dominio.com",
  "subdomain": "api",
  "baseUrl": "https://seu-dominio.com",
  "customRoutes": {
    "booking": "/booking",
    "eventTypes": "/event-types",
    "users": "/user",
    "health": "/health",
    "root": "/"
  },
  "endpoints": {
    "users": "https://seu-dominio.com/user",
    "bookings": "https://seu-dominio.com/booking",
    "eventTypes": "https://seu-dominio.com/event-types",
    "health": "https://seu-dominio.com/health",
    "setup": "https://seu-dominio.com/setup",
    "explore": "https://seu-dominio.com/explore"
  },
  "examples": {
    "getAllUsers": "GET https://seu-dominio.com/user",
    "getUserById": "GET https://seu-dominio.com/user/1",
    "getUserByEmail": "GET https://seu-dominio.com/user/email/usuario@exemplo.com",
    "createUser": "POST https://seu-dominio.com/user",
    "updateUser": "PUT https://seu-dominio.com/user/1",
    "deleteUser": "DELETE https://seu-dominio.com/user/1",
    "getBookings": "GET https://seu-dominio.com/booking/user/1",
    "createBooking": "POST https://seu-dominio.com/booking",
    "getEventTypes": "GET https://seu-dominio.com/event-types",
    "getEventTypeById": "GET https://seu-dominio.com/event-types/1"
  }
}
```

---

## ❤️ **Health Check**

### **GET** `/health`
Verifica o status da aplicação e conexão com o banco de dados.

**Resposta de Sucesso (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"
}
```

**Resposta de Erro (503):**
```json
{
  "status": "ERROR",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "disconnected",
  "error": "connection failed"
}
```

---

## 👥 **Usuários**

### **GET** `/user`
Lista todos os usuários com filtros e paginação.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `email` (opcional): Filtrar por email (busca parcial)
- `name` (opcional): Filtrar por nome (busca parcial)
- `sortBy` (opcional): Campo para ordenação (id, name, email, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

**Exemplo:**
```bash
GET /user?page=1&limit=10&email=gmail&sortBy=name&sortOrder=ASC
```

**Resposta:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "email": "gmail",
    "name": null,
    "sortBy": "name",
    "sortOrder": "ASC"
  }
}
```

### **GET** `/user/email/{email}`
Busca um usuário específico por email.

**Parâmetros:**
- `email` (string): Email do usuário

**Exemplo:**
```bash
GET /user/email/joao@exemplo.com
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Usuário não encontrado"
}
```

### **GET** `/user/{userId}`
Busca um usuário específico por ID.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Exemplo:**
```bash
GET /user/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Usuário não encontrado"
}
```

### **POST** `/user`
Cria um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Nome e email são obrigatórios"
}
```

**Resposta de Erro (409):**
```json
{
  "error": "Email já está em uso"
}
```

### **PUT** `/user/{userId}`
Atualiza um usuário existente.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Body:**
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@exemplo.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "João Silva Santos",
  "email": "joao.santos@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Usuário não encontrado"
}
```

**Resposta de Erro (409):**
```json
{
  "error": "Email já está em uso"
}
```

### **DELETE** `/user/{userId}`
Deleta um usuário.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Exemplo:**
```bash
DELETE /user/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário deletado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Usuário não encontrado"
}
```

---

## 📅 **Agendamentos**

### **GET** `/booking/user/{userId}`
Lista todos os agendamentos de um usuário específico.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Exemplo:**
```bash
GET /booking/user/1
```

**Resposta:**
```json
[
  {
    "uid": "123e4567-e89b-12d3-a456-426614174000",
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T10:30:00.000Z",
    "title": "Consulta Médica",
    "description": "Consulta de rotina",
    "created_at": "2024-01-15T09:00:00.000Z",
    "updated_at": "2024-01-15T09:00:00.000Z"
  }
]
```

### **POST** `/booking`
Cria um novo agendamento.

**Body:**
```json
{
  "userId": 1,
  "eventTypeId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "title": "Consulta Médica",
  "description": "Consulta de rotina"
}
```

**Resposta de Sucesso (201):**
```json
{
  "uid": "123e4567-e89b-12d3-a456-426614174000",
  "userId": 1,
  "eventTypeId": 1,
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T10:30:00.000Z",
  "title": "Consulta Médica",
  "description": "Consulta de rotina",
  "created_at": "2024-01-15T09:00:00.000Z",
  "updated_at": "2024-01-15T09:00:00.000Z"
}
```

### **PUT** `/booking/{uid}`
Atualiza um agendamento existente.

**Parâmetros:**
- `uid` (string): UUID do agendamento

**Body:**
```json
{
  "eventTypeId": 2,
  "startTime": "2024-01-15T11:00:00Z",
  "endTime": "2024-01-15T11:30:00Z",
  "title": "Consulta Atualizada",
  "description": "Nova descrição"
}
```

**Resposta de Sucesso (200):**
```json
{
  "uid": "123e4567-e89b-12d3-a456-426614174000",
  "userId": 1,
  "eventTypeId": 2,
  "startTime": "2024-01-15T11:00:00.000Z",
  "endTime": "2024-01-15T11:30:00.000Z",
  "title": "Consulta Atualizada",
  "description": "Nova descrição",
  "created_at": "2024-01-15T09:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Agendamento não encontrado"
}
```

### **DELETE** `/booking/{uid}`
Cancela (deleta) um agendamento.

**Parâmetros:**
- `uid` (string): UUID do agendamento

**Exemplo:**
```bash
DELETE /booking/123e4567-e89b-12d3-a456-426614174000
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Agendamento cancelado com sucesso",
  "booking": {
    "uid": "123e4567-e89b-12d3-a456-426614174000",
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T10:30:00.000Z",
    "title": "Consulta Médica",
    "description": "Consulta de rotina",
    "created_at": "2024-01-15T09:00:00.000Z",
    "updated_at": "2024-01-15T09:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Agendamento não encontrado"
}
```

---

## 🎯 **Tipos de Eventos**

### **GET** `/event-types`
Lista todos os tipos de eventos.

**Exemplo:**
```bash
GET /event-types
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Consulta Médica",
    "slug": "consulta-medica",
    "length": 30,
    "description": "Consulta médica de 30 minutos",
    "hidden": false,
    "userId": 1,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### **GET** `/event-types/{id}`
Busca um tipo de evento específico por ID.

**Parâmetros:**
- `id` (integer): ID do tipo de evento

**Exemplo:**
```bash
GET /event-types/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "Consulta Médica",
  "slug": "consulta-medica",
  "length": 30,
  "description": "Consulta médica de 30 minutos",
  "hidden": false,
  "userId": 1,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Tipo de evento não encontrado"
}
```

### **POST** `/event-types`
Cria um novo tipo de evento.

**Body:**
```json
{
  "title": "Consulta Médica",
  "slug": "consulta-medica",
  "length": 30,
  "description": "Consulta médica de 30 minutos",
  "hidden": false,
  "userId": 1
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "title": "Consulta Médica",
  "slug": "consulta-medica",
  "length": 30,
  "description": "Consulta médica de 30 minutos",
  "hidden": false,
  "userId": 1,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

### **PUT** `/event-types/{id}`
Atualiza um tipo de evento existente.

**Parâmetros:**
- `id` (integer): ID do tipo de evento

**Body:**
```json
{
  "title": "Consulta Médica Atualizada",
  "slug": "consulta-medica-atualizada",
  "length": 45,
  "description": "Consulta médica de 45 minutos",
  "hidden": false
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "Consulta Médica Atualizada",
  "slug": "consulta-medica-atualizada",
  "length": 45,
  "description": "Consulta médica de 45 minutos",
  "hidden": false,
  "userId": 1,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Tipo de evento não encontrado"
}
```

### **DELETE** `/event-types/{id}`
Deleta um tipo de evento.

**Parâmetros:**
- `id` (integer): ID do tipo de evento

**Exemplo:**
```bash
DELETE /event-types/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Tipo de evento deletado com sucesso",
  "eventType": {
    "id": 1,
    "title": "Consulta Médica",
    "slug": "consulta-medica",
    "length": 30,
    "description": "Consulta médica de 30 minutos",
    "hidden": false,
    "userId": 1,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Tipo de evento não encontrado"
}
```

---

## 🔧 **Setup do Banco de Dados**

### **POST** `/setup/init-database`
Inicializa o banco de dados criando todas as tabelas necessárias.

**Exemplo:**
```bash
POST /setup/init-database
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso!",
  "tables": ["User", "EventType", "Booking"],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (500):**
```json
{
  "success": false,
  "error": "Erro ao inicializar banco de dados",
  "details": "connection failed"
}
```

### **GET** `/setup/database-status`
Verifica o status do banco de dados e tabelas.

**Exemplo:**
```bash
GET /setup/database-status
```

**Resposta:**
```json
{
  "database": "connected",
  "tables": {
    "User": {
      "exists": true,
      "count": 5
    },
    "EventType": {
      "exists": true,
      "count": 3
    },
    "Booking": {
      "exists": true,
      "count": 10
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **POST** `/setup/seed-data`
Cria dados de exemplo no banco de dados.

**Exemplo:**
```bash
POST /setup/seed-data
```

**Resposta de Sucesso (200):**
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

---

## 🔍 **Exploração do Banco de Dados**

### **GET** `/explore/tables`
Lista todas as tabelas disponíveis no banco de dados.

**Exemplo:**
```bash
GET /explore/tables
```

**Resposta:**
```json
{
  "success": true,
  "tables": [
    {
      "table_name": "users",
      "table_type": "BASE TABLE"
    },
    {
      "table_name": "Booking",
      "table_type": "BASE TABLE"
    },
    {
      "table_name": "EventType",
      "table_type": "BASE TABLE"
    }
  ],
  "count": 82,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/explore/table/{tableName}`
Mostra a estrutura detalhada de uma tabela específica.

**Parâmetros:**
- `tableName` (string): Nome da tabela

**Exemplo:**
```bash
GET /explore/table/users
```

**Resposta:**
```json
{
  "success": true,
  "tableName": "users",
  "columns": [
    {
      "column_name": "id",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "nextval('users_id_seq'::regclass)",
      "character_maximum_length": null
    },
    {
      "column_name": "name",
      "data_type": "character varying",
      "is_nullable": "YES",
      "column_default": null,
      "character_maximum_length": 255
    },
    {
      "column_name": "email",
      "data_type": "character varying",
      "is_nullable": "YES",
      "column_default": null,
      "character_maximum_length": 255
    }
  ],
  "primaryKeys": ["id"],
  "foreignKeys": [],
  "recordCount": 5,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/explore/table/{tableName}/sample`
Mostra uma amostra de dados de uma tabela específica.

**Parâmetros:**
- `tableName` (string): Nome da tabela
- `limit` (query, opcional): Número de registros (padrão: 5)

**Exemplo:**
```bash
GET /explore/table/users/sample?limit=3
```

**Resposta:**
```json
{
  "success": true,
  "tableName": "users",
  "sample": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "limit": 3,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/explore/search/users`
Busca tabelas e colunas relacionadas a usuários.

**Exemplo:**
```bash
GET /explore/search/users
```

**Resposta:**
```json
{
  "success": true,
  "userRelatedTables": [
    {
      "table_name": "users",
      "column_name": "id",
      "data_type": "integer"
    },
    {
      "table_name": "users",
      "column_name": "email",
      "data_type": "character varying"
    },
    {
      "table_name": "users",
      "column_name": "name",
      "data_type": "character varying"
    }
  ],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/explore/search/events`
Busca tabelas e colunas relacionadas a eventos e agendamentos.

**Exemplo:**
```bash
GET /explore/search/events
```

**Resposta:**
```json
{
  "success": true,
  "eventRelatedTables": [
    {
      "table_name": "Booking",
      "column_name": "id",
      "data_type": "uuid"
    },
    {
      "table_name": "EventType",
      "column_name": "id",
      "data_type": "integer"
    },
    {
      "table_name": "EventType",
      "column_name": "title",
      "data_type": "character varying"
    }
  ],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/explore/info`
Retorna informações gerais sobre o banco de dados.

**Exemplo:**
```bash
GET /explore/info
```

**Resposta:**
```json
{
  "success": true,
  "database": {
    "database_name": "calcom_db",
    "current_user": "calcom_user",
    "postgres_version": "PostgreSQL 15.4"
  },
  "tableCount": 82,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## ⚠️ **Códigos de Status HTTP**

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já em uso) |
| 500 | Internal Server Error | Erro interno do servidor |
| 503 | Service Unavailable | Serviço indisponível (ex: banco offline) |

---

## 🔧 **Rotas Customizadas**

A API suporta rotas customizadas através de variáveis de ambiente:

### **Variáveis de Ambiente:**
```env
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

### **Exemplos de Configuração:**

#### **Configuração Padrão:**
- Usuários: `/user`
- Agendamentos: `/booking`
- Tipos de Eventos: `/event-types`
- Health Check: `/health`

#### **Configuração em Português:**
```env
BOOKING_ROUTE=/agendamento
EVENT_TYPE_ROUTE=/tipo-evento
USER_ROUTE=/usuario
HEALTH_ROUTE=/status
```

#### **Configuração com Prefixo:**
```env
BOOKING_ROUTE=/api/booking
EVENT_TYPE_ROUTE=/api/event-types
USER_ROUTE=/api/user
HEALTH_ROUTE=/api/health
ROOT_ROUTE=/api
```

---

## 📱 **Exemplos de Uso**

### **JavaScript/Fetch:**
```javascript
const baseUrl = 'https://seu-dominio.com';

// Listar usuários
fetch(`${baseUrl}/user`)
  .then(response => response.json())
  .then(data => console.log(data.users));

// Criar agendamento
fetch(`${baseUrl}/booking`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 1,
    eventTypeId: 1,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:30:00Z',
    title: 'Consulta Médica'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### **cURL:**
```bash
# Listar usuários
curl https://seu-dominio.com/user

# Criar agendamento
curl -X POST https://seu-dominio.com/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "title": "Consulta Médica"
  }'

# Buscar usuário por email
curl https://seu-dominio.com/user/email/joao@exemplo.com
```

### **Python/Requests:**
```python
import requests

base_url = 'https://seu-dominio.com'

# Listar usuários
response = requests.get(f'{base_url}/user')
users = response.json()

# Criar agendamento
booking_data = {
    'userId': 1,
    'eventTypeId': 1,
    'startTime': '2024-01-15T10:00:00Z',
    'endTime': '2024-01-15T10:30:00Z',
    'title': 'Consulta Médica'
}
response = requests.post(f'{base_url}/booking', json=booking_data)
booking = response.json()
```

---

## 🚀 **Deploy e Configuração**

### **Variáveis de Ambiente Obrigatórias:**
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### **Variáveis de Ambiente Opcionais:**
```env
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

### **Deploy no Easy Panel:**
1. Crie um novo projeto
2. Configure GitHub como fonte
3. Selecione Nixpacks como build pack
4. Configure as variáveis de ambiente
5. Faça o deploy

---

## 📞 **Suporte**

Para suporte e dúvidas:
- Verifique os logs no Easy Panel
- Use o endpoint `/health` para verificar status
- Use os endpoints `/explore/*` para investigar o banco
- Consulte a documentação completa no repositório

**🎯 API Cal.com - Documentação Completa! 🚀**
