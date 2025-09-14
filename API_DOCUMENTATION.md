# 📚 Documentação da API - Cal.com

## 🌐 Base URL
```
https://seu-dominio.com
```

## 🔑 Autenticação
Atualmente a API não requer autenticação. Para implementar autenticação, adicione headers de autorização conforme necessário.

## 📋 Endpoints Disponíveis

**Total de Endpoints Implementados: 42**

### 📊 **Resumo por Categoria:**
- 👤 **Usuários**: 6 endpoints
- 📅 **Agendamentos**: 4 endpoints  
- 🎯 **Tipos de Eventos**: 5 endpoints
- ⏰ **Disponibilidade**: 9 endpoints
- 📅 **Schedules**: 8 endpoints
- ⏰ **Slots**: 3 endpoints
- 👥 **Teams**: 7 endpoints
- 👥 **Memberships**: 8 endpoints
- 🔧 **Setup**: 3 endpoints
- 🔍 **Exploração**: 6 endpoints

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

### **GET** `/bookings`
Lista todos os agendamentos com informações detalhadas.

**Parâmetros de Query:**
- Nenhum

**Exemplo:**
```bash
GET /bookings
```

**Resposta:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "uid": "123e4567-e89b-12d3-a456-426614174000",
      "userId": 1,
      "eventTypeId": 1,
      "startTime": "2024-01-15T10:00:00.000Z",
      "endTime": "2024-01-15T11:00:00.000Z",
      "title": "Reunião de Trabalho",
      "description": "Discussão sobre projeto"
    }
  ]
}
```

### **GET** `/bookings/debug/table-structure`
Endpoint de debug para verificar a estrutura da tabela de agendamentos.

**Parâmetros:**
- Nenhum

**Exemplo:**
```bash
GET /bookings/debug/table-structure
```

**Resposta:**
```json
{
  "success": true,
  "tableExists": true,
  "structure": [
    {
      "column_name": "id",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "nextval('\"Booking_id_seq\"'::regclass)"
    }
  ],
  "totalRecords": 5,
  "sampleData": [...]
}
```

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

## ⏰ **Disponibilidade (Availability)**

### **GET** `/availability`
Lista todas as disponibilidades com formato estruturado por padrão.

**Parâmetros de Query:**
- `format` (string): Formato de resposta
  - `structured` (padrão): Formato estruturado com horários organizados por dias
  - `original`: Formato original com dados do banco
- `page` (integer): Número da página (apenas para formato original)
- `limit` (integer): Limite de registros por página (apenas para formato original)
- `userId` (integer): Filtrar por usuário (apenas para formato original)
- `scheduleId` (integer): Filtrar por schedule (apenas para formato original)
- `date` (string): Filtrar por data (apenas para formato original)
- `sortBy` (string): Campo para ordenação (apenas para formato original)
- `sortOrder` (string): Ordem da classificação (ASC/DESC) (apenas para formato original)

**Exemplo (Formato Estruturado - Padrão):**
```bash
GET /availability
```

**Resposta (Formato Estruturado):**
```json
[
  {
    "data": {
      "dates": [
        {
          "day": "Monday",
          "date": "2025-09-15",
          "hours": [
            {
              "start": "10:00 BRT",
              "end": "11:00 BRT"
            },
            {
              "start": "13:00 BRT",
              "end": "14:00 BRT"
            },
            {
              "start": "14:00 BRT",
              "end": "15:00 BRT"
            },
            {
              "start": "16:00 BRT",
              "end": "17:00 BRT"
            },
            {
              "start": "17:00 BRT",
              "end": "18:00 BRT"
            },
            {
              "start": "18:00 BRT",
              "end": "19:00 BRT"
            }
          ]
        },
        {
          "day": "Tuesday",
          "date": "2025-09-16",
          "hours": [
            {
              "start": "08:00 BRT",
              "end": "09:00 BRT"
            },
            {
              "start": "09:00 BRT",
              "end": "10:00 BRT"
            }
          ]
        }
      ]
    },
    "meta": {
      "serverTime": "2025-09-14T16:52:52.114Z",
      "statusCode": 200,
      "message": "FOUND"
    }
  }
]
```

**Exemplo (Formato Original):**
```bash
GET /availability?format=original&page=1&limit=10
```

**Resposta (Formato Original):**
```json
{
  "availability": [
    {
      "id": 1,
      "userId": 1,
      "scheduleId": 1,
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T17:00:00.000Z",
      "days": [1, 2, 3, 4, 5],
      "created_at": "2024-01-15T08:00:00.000Z",
      "updated_at": "2024-01-15T08:00:00.000Z"
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
    "userId": null,
    "scheduleId": null,
    "date": null,
    "sortBy": "id",
    "sortOrder": "ASC"
  }
}
```

**Horários por Dia da Semana:**
- **Segunda-feira**: 10h-19h (horários limitados)
- **Terça a Sexta**: 8h-19h (horários completos)
- **Sábado**: 8h-15h (horários limitados)
- **Domingo**: Sem horários disponíveis

### **GET** `/availability` (Formato Original)
Lista todas as disponibilidades com filtros e paginação (formato original).

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `userId` (opcional): Filtrar por ID do usuário
- `scheduleId` (opcional): Filtrar por ID do schedule
- `date` (opcional): Filtrar por data específica
- `sortBy` (opcional): Campo para ordenação (id, userId, scheduleId, startTime, endTime, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

**Exemplo:**
```bash
GET /availability?page=1&limit=10&userId=1&date=2024-01-15&sortBy=startTime&sortOrder=ASC
```

**Resposta:**
```json
{
  "availability": [
    {
      "id": 1,
      "userId": 1,
      "scheduleId": 1,
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T17:00:00.000Z",
      "days": [1, 2, 3, 4, 5],
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "userId": "1",
    "scheduleId": null,
    "date": "2024-01-15",
    "sortBy": "startTime",
    "sortOrder": "ASC"
  }
}
```

### **GET** `/availability/user/{userId}`
Lista todas as disponibilidades de um usuário específico.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Parâmetros de Query:**
- `date` (opcional): Filtrar por data específica
- `scheduleId` (opcional): Filtrar por ID do schedule

**Exemplo:**
```bash
GET /availability/user/1?date=2024-01-15&scheduleId=1
```

**Resposta:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "scheduleId": 1,
    "startTime": "2024-01-15T09:00:00.000Z",
    "endTime": "2024-01-15T17:00:00.000Z",
    "days": [1, 2, 3, 4, 5],
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### **GET** `/availability/schedule/{scheduleId}`
Lista todas as disponibilidades de um schedule específico.

**Parâmetros:**
- `scheduleId` (integer): ID do schedule

**Parâmetros de Query:**
- `date` (opcional): Filtrar por data específica

**Exemplo:**
```bash
GET /availability/schedule/1?date=2024-01-15
```

**Resposta:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "scheduleId": 1,
    "startTime": "2024-01-15T09:00:00.000Z",
    "endTime": "2024-01-15T17:00:00.000Z",
    "days": [1, 2, 3, 4, 5],
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### **GET** `/availability/{id}`
Busca uma disponibilidade específica por ID.

**Parâmetros:**
- `id` (integer): ID da disponibilidade

**Exemplo:**
```bash
GET /availability/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "scheduleId": 1,
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T17:00:00.000Z",
  "days": [1, 2, 3, 4, 5],
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Disponibilidade não encontrada"
}
```

### **POST** `/availability`
Cria uma nova disponibilidade.

**Body:**
```json
{
  "userId": 1,
  "scheduleId": 1,
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "days": [1, 2, 3, 4, 5]
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "userId": 1,
  "scheduleId": 1,
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T17:00:00.000Z",
  "days": [1, 2, 3, 4, 5],
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "userId, scheduleId, startTime e endTime são obrigatórios"
}
```

### **PUT** `/availability/{id}`
Atualiza uma disponibilidade existente.

**Parâmetros:**
- `id` (integer): ID da disponibilidade

**Body:**
```json
{
  "scheduleId": 2,
  "startTime": "2024-01-15T08:00:00Z",
  "endTime": "2024-01-15T18:00:00Z",
  "days": [1, 2, 3, 4, 5, 6]
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "scheduleId": 2,
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T18:00:00.000Z",
  "days": [1, 2, 3, 4, 5, 6],
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Disponibilidade não encontrada"
}
```

### **DELETE** `/availability/{id}`
Deleta uma disponibilidade.

**Parâmetros:**
- `id` (integer): ID da disponibilidade

**Exemplo:**
```bash
DELETE /availability/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Disponibilidade deletada com sucesso",
  "availability": {
    "id": 1,
    "userId": 1,
    "scheduleId": 1,
    "startTime": "2024-01-15T09:00:00.000Z",
    "endTime": "2024-01-15T17:00:00.000Z",
    "days": [1, 2, 3, 4, 5],
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Disponibilidade não encontrada"
}
```

### **POST** `/availability/check`
Verifica se um usuário está disponível em um período específico.

**Body:**
```json
{
  "userId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "date": "2024-01-15"
}
```

**Resposta:**
```json
{
  "available": true,
  "availability": [
    {
      "id": 1,
      "userId": 1,
      "scheduleId": 1,
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T17:00:00.000Z",
      "days": [1, 2, 3, 4, 5],
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "requestedPeriod": {
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "date": "2024-01-15"
  }
}
```

### **GET** `/availability/user/{userId}/available-slots`
Obtém horários disponíveis para um usuário em uma data específica.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Parâmetros de Query:**
- `date` (obrigatório): Data para verificar disponibilidade (formato: YYYY-MM-DD)
- `duration` (opcional): Duração dos slots em minutos (padrão: 30)

**Exemplo:**
```bash
GET /availability/user/1/available-slots?date=2024-01-15&duration=30
```

**Resposta:**
```json
{
  "date": "2024-01-15",
  "userId": 1,
  "duration": 30,
  "availableSlots": [
    {
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T09:30:00.000Z",
      "duration": 30
    },
    {
      "startTime": "2024-01-15T09:30:00.000Z",
      "endTime": "2024-01-15T10:00:00.000Z",
      "duration": 30
    },
    {
      "startTime": "2024-01-15T10:00:00.000Z",
      "endTime": "2024-01-15T10:30:00.000Z",
      "duration": 30
    }
  ],
  "totalSlots": 16
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Parâmetro date é obrigatório"
}
```

---

## 📅 **Schedules (Horários)**

### **GET** `/schedules`
Lista todos os schedules com filtros e paginação.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `userId` (opcional): Filtrar por ID do usuário
- `name` (opcional): Filtrar por nome do schedule
- `timeZone` (opcional): Filtrar por timezone
- `sortBy` (opcional): Campo para ordenação (id, userId, name, timeZone, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

**Exemplo:**
```bash
GET /schedules?page=1&limit=10&userId=1&name=Horário%20Comercial&sortBy=name&sortOrder=ASC
```

**Resposta:**
```json
{
  "schedules": [
    {
      "id": 1,
      "userId": 1,
      "name": "Horário Comercial",
      "timeZone": "America/Sao_Paulo",
      "availability": {
        "monday": [{"start": "09:00", "end": "17:00"}],
        "tuesday": [{"start": "09:00", "end": "17:00"}],
        "wednesday": [{"start": "09:00", "end": "17:00"}],
        "thursday": [{"start": "09:00", "end": "17:00"}],
        "friday": [{"start": "09:00", "end": "17:00"}]
      },
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "userId": "1",
    "name": "Horário Comercial",
    "timeZone": null,
    "sortBy": "name",
    "sortOrder": "ASC"
  }
}
```

### **GET** `/schedules/user/{userId}`
Lista todos os schedules de um usuário específico.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Parâmetros de Query:**
- `name` (opcional): Filtrar por nome do schedule
- `timeZone` (opcional): Filtrar por timezone

**Exemplo:**
```bash
GET /schedules/user/1?name=Horário%20Comercial&timeZone=America/Sao_Paulo
```

**Resposta:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Horário Comercial",
    "timeZone": "America/Sao_Paulo",
    "availability": {
      "monday": [{"start": "09:00", "end": "17:00"}],
      "tuesday": [{"start": "09:00", "end": "17:00"}],
      "wednesday": [{"start": "09:00", "end": "17:00"}],
      "thursday": [{"start": "09:00", "end": "17:00"}],
      "friday": [{"start": "09:00", "end": "17:00"}]
    },
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### **GET** `/schedules/{id}`
Busca um schedule específico por ID.

**Parâmetros:**
- `id` (integer): ID do schedule

**Exemplo:**
```bash
GET /schedules/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "Horário Comercial",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}],
    "wednesday": [{"start": "09:00", "end": "17:00"}],
    "thursday": [{"start": "09:00", "end": "17:00"}],
    "friday": [{"start": "09:00", "end": "17:00"}]
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Schedule não encontrado"
}
```

### **POST** `/schedules`
Cria um novo schedule.

**Body:**
```json
{
  "userId": 1,
  "name": "Horário Comercial",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}],
    "wednesday": [{"start": "09:00", "end": "17:00"}],
    "thursday": [{"start": "09:00", "end": "17:00"}],
    "friday": [{"start": "09:00", "end": "17:00"}]
  }
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "Horário Comercial",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}],
    "wednesday": [{"start": "09:00", "end": "17:00"}],
    "thursday": [{"start": "09:00", "end": "17:00"}],
    "friday": [{"start": "09:00", "end": "17:00"}]
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "userId, name e timeZone são obrigatórios"
}
```

### **PUT** `/schedules/{id}`
Atualiza um schedule existente.

**Parâmetros:**
- `id` (integer): ID do schedule

**Body:**
```json
{
  "name": "Horário Estendido",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "08:00", "end": "18:00"}],
    "tuesday": [{"start": "08:00", "end": "18:00"}],
    "wednesday": [{"start": "08:00", "end": "18:00"}],
    "thursday": [{"start": "08:00", "end": "18:00"}],
    "friday": [{"start": "08:00", "end": "18:00"}]
  }
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "Horário Estendido",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "08:00", "end": "18:00"}],
    "tuesday": [{"start": "08:00", "end": "18:00"}],
    "wednesday": [{"start": "08:00", "end": "18:00"}],
    "thursday": [{"start": "08:00", "end": "18:00"}],
    "friday": [{"start": "08:00", "end": "18:00"}]
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### **DELETE** `/schedules/{id}`
Deleta um schedule.

**Parâmetros:**
- `id` (integer): ID do schedule

**Exemplo:**
```bash
DELETE /schedules/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Schedule deletado com sucesso",
  "schedule": {
    "id": 1,
    "userId": 1,
    "name": "Horário Comercial",
    "timeZone": "America/Sao_Paulo",
    "availability": {
      "monday": [{"start": "09:00", "end": "17:00"}],
      "tuesday": [{"start": "09:00", "end": "17:00"}],
      "wednesday": [{"start": "09:00", "end": "17:00"}],
      "thursday": [{"start": "09:00", "end": "17:00"}],
      "friday": [{"start": "09:00", "end": "17:00"}]
    },
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

### **GET** `/schedules/{id}/availability`
Obtém a disponibilidade de um schedule específico.

**Parâmetros:**
- `id` (integer): ID do schedule

**Exemplo:**
```bash
GET /schedules/1/availability
```

**Resposta:**
```json
{
  "scheduleId": 1,
  "scheduleName": "Horário Comercial",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}],
    "wednesday": [{"start": "09:00", "end": "17:00"}],
    "thursday": [{"start": "09:00", "end": "17:00"}],
    "friday": [{"start": "09:00", "end": "17:00"}]
  }
}
```

### **PUT** `/schedules/{id}/availability`
Atualiza a disponibilidade de um schedule específico.

**Parâmetros:**
- `id` (integer): ID do schedule

**Body:**
```json
{
  "availability": {
    "monday": [{"start": "08:00", "end": "18:00"}],
    "tuesday": [{"start": "08:00", "end": "18:00"}],
    "wednesday": [{"start": "08:00", "end": "18:00"}],
    "thursday": [{"start": "08:00", "end": "18:00"}],
    "friday": [{"start": "08:00", "end": "18:00"}]
  }
}
```

**Resposta:**
```json
{
  "id": 1,
  "userId": 1,
  "name": "Horário Comercial",
  "timeZone": "America/Sao_Paulo",
  "availability": {
    "monday": [{"start": "08:00", "end": "18:00"}],
    "tuesday": [{"start": "08:00", "end": "18:00"}],
    "wednesday": [{"start": "08:00", "end": "18:00"}],
    "thursday": [{"start": "08:00", "end": "18:00"}],
    "friday": [{"start": "08:00", "end": "18:00"}]
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

---

## ⏰ **Slots (Horários Disponíveis)**

### **GET** `/slots`
Obtém todos os slots disponíveis entre um período.

**Parâmetros de Query:**
- `startTime` (obrigatório): Data/hora de início (formato ISO 8601)
- `endTime` (obrigatório): Data/hora de fim (formato ISO 8601)
- `userId` (opcional): Filtrar por ID do usuário
- `eventTypeId` (opcional): Filtrar por ID do tipo de evento
- `timeZone` (opcional): Timezone (padrão: UTC)

**Exemplo:**
```bash
GET /slots?startTime=2024-01-15T09:00:00Z&endTime=2024-01-15T17:00:00Z&userId=1&eventTypeId=1&timeZone=America/Sao_Paulo
```

**Resposta:**
```json
{
  "slots": [
    {
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T09:30:00.000Z",
      "duration": 30,
      "scheduleId": 1,
      "scheduleName": "Horário Comercial",
      "scheduleTimezone": "America/Sao_Paulo",
      "availabilityId": 1
    },
    {
      "startTime": "2024-01-15T09:30:00.000Z",
      "endTime": "2024-01-15T10:00:00.000Z",
      "duration": 30,
      "scheduleId": 1,
      "scheduleName": "Horário Comercial",
      "scheduleTimezone": "America/Sao_Paulo",
      "availabilityId": 1
    }
  ],
  "totalSlots": 16,
  "period": {
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "timeZone": "America/Sao_Paulo"
  },
  "filters": {
    "userId": "1",
    "eventTypeId": "1"
  }
}
```

### **GET** `/slots/user/{userId}`
Obtém slots disponíveis para um usuário específico.

**Parâmetros:**
- `userId` (integer): ID do usuário

**Parâmetros de Query:**
- `startTime` (obrigatório): Data/hora de início
- `endTime` (obrigatório): Data/hora de fim
- `eventTypeId` (opcional): Filtrar por ID do tipo de evento
- `timeZone` (opcional): Timezone (padrão: UTC)

**Exemplo:**
```bash
GET /slots/user/1?startTime=2024-01-15T09:00:00Z&endTime=2024-01-15T17:00:00Z&eventTypeId=1
```

**Resposta:**
```json
{
  "userId": 1,
  "slots": [
    {
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T09:30:00.000Z",
      "duration": 30,
      "scheduleId": 1,
      "scheduleName": "Horário Comercial",
      "scheduleTimezone": "America/Sao_Paulo",
      "availabilityId": 1
    }
  ],
  "totalSlots": 16,
  "period": {
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "timeZone": "UTC"
  },
  "filters": {
    "eventTypeId": "1"
  }
}
```

### **GET** `/slots/event-type/{eventTypeId}`
Obtém slots disponíveis para um tipo de evento específico.

**Parâmetros:**
- `eventTypeId` (integer): ID do tipo de evento

**Parâmetros de Query:**
- `startTime` (obrigatório): Data/hora de início
- `endTime` (obrigatório): Data/hora de fim
- `timeZone` (opcional): Timezone (padrão: UTC)

**Exemplo:**
```bash
GET /slots/event-type/1?startTime=2024-01-15T09:00:00Z&endTime=2024-01-15T17:00:00Z
```

**Resposta:**
```json
{
  "eventType": {
    "id": 1,
    "title": "Consulta Médica",
    "duration": 30
  },
  "slots": [
    {
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T09:30:00.000Z",
      "duration": 30,
      "eventTypeId": 1,
      "eventTypeTitle": "Consulta Médica",
      "scheduleId": 1,
      "scheduleName": "Horário Comercial",
      "scheduleTimezone": "America/Sao_Paulo",
      "availabilityId": 1
    }
  ],
  "totalSlots": 16,
  "period": {
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "timeZone": "UTC"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "error": "startTime e endTime são obrigatórios"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Tipo de evento não encontrado ou sem disponibilidade"
}
```

---

## 👥 **Teams (Equipes)**

### **GET** `/teams`
Lista todos os teams com filtros e paginação.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `name` (opcional): Filtrar por nome do team
- `slug` (opcional): Filtrar por slug do team
- `sortBy` (opcional): Campo para ordenação (id, name, slug, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

**Exemplo:**
```bash
GET /teams?page=1&limit=10&name=Equipe%20Desenvolvimento&sortBy=name&sortOrder=ASC
```

**Resposta:**
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Equipe Desenvolvimento",
      "slug": "equipe-desenvolvimento",
      "logo": "https://exemplo.com/logo.png",
      "bio": "Equipe responsável pelo desenvolvimento de software",
      "hideBranding": false,
      "isPrivate": false,
      "metadata": {
        "department": "IT",
        "location": "São Paulo"
      },
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "name": "Equipe Desenvolvimento",
    "slug": null,
    "sortBy": "name",
    "sortOrder": "ASC"
  }
}
```

### **GET** `/teams/{id}`
Busca um team específico por ID.

**Parâmetros:**
- `id` (integer): ID do team

**Exemplo:**
```bash
GET /teams/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "Equipe Desenvolvimento",
  "slug": "equipe-desenvolvimento",
  "logo": "https://exemplo.com/logo.png",
  "bio": "Equipe responsável pelo desenvolvimento de software",
  "hideBranding": false,
  "isPrivate": false,
  "metadata": {
    "department": "IT",
    "location": "São Paulo"
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

### **GET** `/teams/slug/{slug}`
Busca um team por slug.

**Parâmetros:**
- `slug` (string): Slug do team

**Exemplo:**
```bash
GET /teams/slug/equipe-desenvolvimento
```

**Resposta:**
```json
{
  "id": 1,
  "name": "Equipe Desenvolvimento",
  "slug": "equipe-desenvolvimento",
  "logo": "https://exemplo.com/logo.png",
  "bio": "Equipe responsável pelo desenvolvimento de software",
  "hideBranding": false,
  "isPrivate": false,
  "metadata": {
    "department": "IT",
    "location": "São Paulo"
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

### **POST** `/teams`
Cria um novo team.

**Body:**
```json
{
  "name": "Equipe Desenvolvimento",
  "slug": "equipe-desenvolvimento",
  "logo": "https://exemplo.com/logo.png",
  "bio": "Equipe responsável pelo desenvolvimento de software",
  "hideBranding": false,
  "isPrivate": false,
  "metadata": {
    "department": "IT",
    "location": "São Paulo"
  }
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "name": "Equipe Desenvolvimento",
  "slug": "equipe-desenvolvimento",
  "logo": "https://exemplo.com/logo.png",
  "bio": "Equipe responsável pelo desenvolvimento de software",
  "hideBranding": false,
  "isPrivate": false,
  "metadata": {
    "department": "IT",
    "location": "São Paulo"
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "name e slug são obrigatórios"
}
```

**Resposta de Erro (409):**
```json
{
  "error": "Slug já existe"
}
```

### **PUT** `/teams/{id}`
Atualiza um team existente.

**Parâmetros:**
- `id` (integer): ID do team

**Body:**
```json
{
  "name": "Equipe Desenvolvimento Atualizada",
  "bio": "Equipe responsável pelo desenvolvimento de software e inovação",
  "hideBranding": true,
  "metadata": {
    "department": "IT",
    "location": "São Paulo",
    "size": "10"
  }
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "Equipe Desenvolvimento Atualizada",
  "slug": "equipe-desenvolvimento",
  "logo": "https://exemplo.com/logo.png",
  "bio": "Equipe responsável pelo desenvolvimento de software e inovação",
  "hideBranding": true,
  "isPrivate": false,
  "metadata": {
    "department": "IT",
    "location": "São Paulo",
    "size": "10"
  },
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### **DELETE** `/teams/{id}`
Deleta um team.

**Parâmetros:**
- `id` (integer): ID do team

**Exemplo:**
```bash
DELETE /teams/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Team deletado com sucesso",
  "team": {
    "id": 1,
    "name": "Equipe Desenvolvimento",
    "slug": "equipe-desenvolvimento",
    "logo": "https://exemplo.com/logo.png",
    "bio": "Equipe responsável pelo desenvolvimento de software",
    "hideBranding": false,
    "isPrivate": false,
    "metadata": {
      "department": "IT",
      "location": "São Paulo"
    },
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

### **GET** `/teams/{id}/members`
Lista os membros de um team.

**Parâmetros:**
- `id` (integer): ID do team

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `role` (opcional): Filtrar por role (OWNER, ADMIN, MEMBER)

**Exemplo:**
```bash
GET /teams/1/members?page=1&limit=10&role=ADMIN
```

**Resposta:**
```json
{
  "team": {
    "id": 1,
    "name": "Equipe Desenvolvimento"
  },
  "members": [
    {
      "id": 1,
      "userId": 1,
      "teamId": 1,
      "role": "ADMIN",
      "accepted": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z",
      "user_name": "João Silva",
      "user_email": "joao@exemplo.com",
      "user_username": "joao.silva",
      "team_name": "Equipe Desenvolvimento",
      "team_slug": "equipe-desenvolvimento"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "role": "ADMIN"
  }
}
```

### **GET** `/teams/{id}/event-types`
Lista os tipos de eventos de um team.

**Parâmetros:**
- `id` (integer): ID do team

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `active` (opcional): Filtrar por status ativo (true/false)

**Exemplo:**
```bash
GET /teams/1/event-types?page=1&limit=10&active=true
```

**Resposta:**
```json
{
  "team": {
    "id": 1,
    "name": "Equipe Desenvolvimento"
  },
  "eventTypes": [
    {
      "id": 1,
      "title": "Reunião de Equipe",
      "slug": "reuniao-equipe",
      "description": "Reunião semanal da equipe de desenvolvimento",
      "length": 60,
      "schedulingType": "ROUND_ROBIN",
      "active": true,
      "teamId": 1,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "active": true
  }
}
```

---

## 👤 **Memberships (Membros)**

### **GET** `/memberships`
Lista todos os memberships com filtros e paginação.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `userId` (opcional): Filtrar por ID do usuário
- `teamId` (opcional): Filtrar por ID do team
- `role` (opcional): Filtrar por role (OWNER, ADMIN, MEMBER)
- `accepted` (opcional): Filtrar por status de aceitação (true/false)
- `sortBy` (opcional): Campo para ordenação (id, userId, teamId, role, accepted, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

**Exemplo:**
```bash
GET /memberships?page=1&limit=10&userId=1&role=ADMIN&accepted=true&sortBy=created_at&sortOrder=DESC
```

**Resposta:**
```json
{
  "memberships": [
    {
      "id": 1,
      "userId": 1,
      "teamId": 1,
      "role": "ADMIN",
      "accepted": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z",
      "user_name": "João Silva",
      "user_email": "joao@exemplo.com",
      "user_username": "joao.silva",
      "team_name": "Equipe Desenvolvimento",
      "team_slug": "equipe-desenvolvimento"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "filters": {
    "userId": "1",
    "teamId": null,
    "role": "ADMIN",
    "accepted": true,
    "sortBy": "created_at",
    "sortOrder": "DESC"
  }
}
```

### **GET** `/memberships/{id}`
Busca um membership específico por ID.

**Parâmetros:**
- `id` (integer): ID do membership

**Exemplo:**
```bash
GET /memberships/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "teamId": 1,
  "role": "ADMIN",
  "accepted": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z",
  "user_name": "João Silva",
  "user_email": "joao@exemplo.com",
  "user_username": "joao.silva",
  "team_name": "Equipe Desenvolvimento",
  "team_slug": "equipe-desenvolvimento"
}
```

### **GET** `/memberships/user/{userId}/team/{teamId}`
Busca um membership por userId e teamId.

**Parâmetros:**
- `userId` (integer): ID do usuário
- `teamId` (integer): ID do team

**Exemplo:**
```bash
GET /memberships/user/1/team/1
```

**Resposta:**
```json
{
  "id": 1,
  "userId": 1,
  "teamId": 1,
  "role": "ADMIN",
  "accepted": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z",
  "user_name": "João Silva",
  "user_email": "joao@exemplo.com",
  "user_username": "joao.silva",
  "team_name": "Equipe Desenvolvimento",
  "team_slug": "equipe-desenvolvimento"
}
```

### **POST** `/memberships`
Cria um novo membership.

**Body:**
```json
{
  "userId": 1,
  "teamId": 1,
  "role": "MEMBER",
  "accepted": false
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "userId": 1,
  "teamId": 1,
  "role": "MEMBER",
  "accepted": false,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z",
  "user_name": "João Silva",
  "user_email": "joao@exemplo.com",
  "user_username": "joao.silva",
  "team_name": "Equipe Desenvolvimento",
  "team_slug": "equipe-desenvolvimento"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "userId e teamId são obrigatórios"
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
  "error": "Usuário já é membro deste team"
}
```

### **PUT** `/memberships/{id}`
Atualiza um membership existente.

**Parâmetros:**
- `id` (integer): ID do membership

**Body:**
```json
{
  "role": "ADMIN",
  "accepted": true
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "userId": 1,
  "teamId": 1,
  "role": "ADMIN",
  "accepted": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "user_name": "João Silva",
  "user_email": "joao@exemplo.com",
  "user_username": "joao.silva",
  "team_name": "Equipe Desenvolvimento",
  "team_slug": "equipe-desenvolvimento"
}
```

### **DELETE** `/memberships/{id}`
Deleta um membership.

**Parâmetros:**
- `id` (integer): ID do membership

**Exemplo:**
```bash
DELETE /memberships/1
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Membership deletado com sucesso",
  "membership": {
    "id": 1,
    "userId": 1,
    "teamId": 1,
    "role": "ADMIN",
    "accepted": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

### **PATCH** `/memberships/{id}/accept`
Aceita um convite de membership.

**Parâmetros:**
- `id` (integer): ID do membership

**Exemplo:**
```bash
PATCH /memberships/1/accept
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Convite aceito com sucesso",
  "membership": {
    "id": 1,
    "userId": 1,
    "teamId": 1,
    "role": "MEMBER",
    "accepted": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "user_name": "João Silva",
    "user_email": "joao@exemplo.com",
    "user_username": "joao.silva",
    "team_name": "Equipe Desenvolvimento",
    "team_slug": "equipe-desenvolvimento"
  }
}
```

### **PATCH** `/memberships/{id}/reject`
Rejeita um convite de membership.

**Parâmetros:**
- `id` (integer): ID do membership

**Exemplo:**
```bash
PATCH /memberships/1/reject
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Convite rejeitado com sucesso",
  "membership": {
    "id": 1,
    "userId": 1,
    "teamId": 1,
    "role": "MEMBER",
    "accepted": false,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
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

// Listar disponibilidades
fetch(`${baseUrl}/availability?page=1&limit=10&userId=1`)
  .then(response => response.json())
  .then(data => console.log(data.availability));

// Verificar disponibilidade
fetch(`${baseUrl}/availability/check`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T11:00:00Z',
    date: '2024-01-15'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Obter slots disponíveis
fetch(`${baseUrl}/availability/user/1/available-slots?date=2024-01-15&duration=30`)
  .then(response => response.json())
  .then(data => console.log(data.availableSlots));

// Criar disponibilidade
fetch(`${baseUrl}/availability`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    scheduleId: 1,
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T17:00:00Z',
    days: [1, 2, 3, 4, 5]
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

# Listar disponibilidades
curl "https://seu-dominio.com/availability?page=1&limit=10&userId=1"

# Verificar disponibilidade
curl -X POST https://seu-dominio.com/availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "date": "2024-01-15"
  }'

# Obter slots disponíveis
curl "https://seu-dominio.com/availability/user/1/available-slots?date=2024-01-15&duration=30"

# Criar disponibilidade
curl -X POST https://seu-dominio.com/availability \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "scheduleId": 1,
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "days": [1, 2, 3, 4, 5]
  }'
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

# Listar disponibilidades
response = requests.get(f'{base_url}/availability', params={
    'page': 1,
    'limit': 10,
    'userId': 1
})
availability = response.json()

# Verificar disponibilidade
check_data = {
    'userId': 1,
    'startTime': '2024-01-15T10:00:00Z',
    'endTime': '2024-01-15T11:00:00Z',
    'date': '2024-01-15'
}
response = requests.post(f'{base_url}/availability/check', json=check_data)
availability_check = response.json()

# Obter slots disponíveis
response = requests.get(f'{base_url}/availability/user/1/available-slots', params={
    'date': '2024-01-15',
    'duration': 30
})
slots = response.json()

# Criar disponibilidade
availability_data = {
    'userId': 1,
    'scheduleId': 1,
    'startTime': '2024-01-15T09:00:00Z',
    'endTime': '2024-01-15T17:00:00Z',
    'days': [1, 2, 3, 4, 5]
}
response = requests.post(f'{base_url}/availability', json=availability_data)
new_availability = response.json()
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
