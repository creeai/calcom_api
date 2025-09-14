# 🛣️ Sistema de Rotas Customizadas

## 📋 Visão Geral

O sistema permite configurar rotas personalizadas através de variáveis de ambiente, permitindo URLs mais amigáveis e flexíveis.

## ⚙️ Variáveis de Ambiente

### **Configuração Básica**
```env
# Rotas customizadas
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

### **Exemplos de Configuração**

#### **Configuração Padrão**
```env
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

#### **Configuração Personalizada**
```env
BOOKING_ROUTE=/agendamentos
EVENT_TYPE_ROUTE=/tipos-evento
USER_ROUTE=/usuarios
HEALTH_ROUTE=/status
ROOT_ROUTE=/api
```

#### **Configuração em Português**
```env
BOOKING_ROUTE=/agendamento
EVENT_TYPE_ROUTE=/tipo-evento
USER_ROUTE=/usuario
HEALTH_ROUTE=/saude
ROOT_ROUTE=/
```

## 🔄 Como Funciona

### **1. Redirecionamento Automático**
- As URLs customizadas são automaticamente redirecionadas para as rotas internas
- O sistema preserva parâmetros e query strings
- Funciona com todos os métodos HTTP (GET, POST, PUT, DELETE)

### **2. Mapeamento de Rotas**
```
URL Customizada → Rota Interna
/booking → /bookings
/event-types → /event-types
/user → /users
/health → /health
/ → /
```

### **3. Exemplos de Uso**

#### **Agendamentos**
```bash
# URL customizada
GET https://meudominio.com/booking/user/1

# Redireciona para
GET https://meudominio.com/bookings/user/1
```

#### **Tipos de Eventos**
```bash
# URL customizada
GET https://meudominio.com/event-types/1

# Redireciona para
GET https://meudominio.com/event-types/1
```

#### **Usuários**
```bash
# URL customizada
GET https://meudominio.com/user/1

# Redireciona para
GET https://meudominio.com/users/1
```

## 🚀 Configuração no Easy Panel

### **1. Variáveis de Ambiente**
No Easy Panel, adicione estas variáveis:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Rotas customizadas
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

### **2. Exemplos de Configuração**

#### **Para API em Português**
```env
BOOKING_ROUTE=/agendamento
EVENT_TYPE_ROUTE=/tipo-evento
USER_ROUTE=/usuario
HEALTH_ROUTE=/status
```

#### **Para API com Prefixo**
```env
BOOKING_ROUTE=/api/booking
EVENT_TYPE_ROUTE=/api/event-types
USER_ROUTE=/api/user
HEALTH_ROUTE=/api/health
ROOT_ROUTE=/api
```

## 📱 Exemplos de Uso

### **JavaScript/Fetch**
```javascript
const baseUrl = 'https://meudominio.com';

// Usando rotas customizadas
fetch(`${baseUrl}/booking/user/1`)
  .then(response => response.json())
  .then(data => console.log(data));

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
});
```

### **cURL**
```bash
# Listar agendamentos
curl https://meudominio.com/booking/user/1

# Criar agendamento
curl -X POST https://meudominio.com/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "title": "Consulta Médica"
  }'

# Listar tipos de eventos
curl https://meudominio.com/event-types

# Obter usuário
curl https://meudominio.com/user/1
```

### **Python/Requests**
```python
import requests

base_url = 'https://meudominio.com'

# Listar agendamentos
response = requests.get(f'{base_url}/booking/user/1')
print(response.json())

# Criar agendamento
booking_data = {
    'userId': 1,
    'eventTypeId': 1,
    'startTime': '2024-01-15T10:00:00Z',
    'endTime': '2024-01-15T10:30:00Z',
    'title': 'Consulta Médica'
}

response = requests.post(f'{base_url}/booking', json=booking_data)
print(response.json())
```

## 🔍 Verificação

### **1. Teste da Rota Raiz**
```bash
curl https://meudominio.com/
```

Resposta esperada:
```json
{
  "message": "Cal.com API - Sistema de Agendamentos",
  "version": "1.0.0",
  "customRoutes": {
    "booking": "/booking",
    "eventTypes": "/event-types",
    "users": "/user",
    "health": "/health",
    "root": "/"
  },
  "endpoints": {
    "users": "https://meudominio.com/user",
    "bookings": "https://meudominio.com/booking",
    "eventTypes": "https://meudominio.com/event-types",
    "health": "https://meudominio.com/health"
  }
}
```

### **2. Teste de Redirecionamento**
```bash
# Teste com logs habilitados
curl -v https://meudominio.com/booking/user/1
```

## 🎯 Vantagens

### **✅ Flexibilidade**
- URLs personalizadas para cada cliente
- Suporte a múltiplos idiomas
- Fácil mudança de rotas

### **✅ Compatibilidade**
- Mantém compatibilidade com rotas originais
- Funciona com todos os métodos HTTP
- Preserva parâmetros e query strings

### **✅ Configuração Simples**
- Apenas variáveis de ambiente
- Sem necessidade de recompilação
- Configuração em tempo de execução

## 🔧 Troubleshooting

### **Problemas Comuns:**

#### **1. Rotas não funcionam**
- ✅ Verifique se as variáveis de ambiente estão configuradas
- ✅ Confirme se o middleware está ativo
- ✅ Verifique os logs de redirecionamento

#### **2. Redirecionamento incorreto**
- ✅ Verifique se a variável de ambiente está correta
- ✅ Confirme se não há conflitos de rotas
- ✅ Teste com logs habilitados

#### **3. Parâmetros perdidos**
- ✅ O sistema preserva parâmetros automaticamente
- ✅ Verifique se a URL está correta
- ✅ Confirme se os parâmetros estão na posição correta

## 🎉 Exemplos Práticos

### **Configuração para Cliente Brasileiro**
```env
BOOKING_ROUTE=/agendamento
EVENT_TYPE_ROUTE=/tipo-evento
USER_ROUTE=/usuario
HEALTH_ROUTE=/status
```

### **Configuração para Cliente Internacional**
```env
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
```

### **Configuração com Prefixo de Versão**
```env
BOOKING_ROUTE=/v1/booking
EVENT_TYPE_ROUTE=/v1/event-types
USER_ROUTE=/v1/user
HEALTH_ROUTE=/v1/health
ROOT_ROUTE=/v1
```

**Agora você pode usar URLs completamente personalizadas! 🚀**
