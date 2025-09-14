# 🌐 Configuração de Domínios e URLs

## 📋 URLs Disponíveis

### **Domínio Padrão do Easy Panel**
```
https://api-cal-app.mimenl.easypanel.host
```

### **Exemplos de Rotas Completas**

#### **1. Informações da API**
```bash
GET https://api-cal-app.mimenl.easypanel.host/
```

#### **2. Health Check**
```bash
GET https://api-cal-app.mimenl.easypanel.host/health
```

#### **3. Usuários**
```bash
# Obter usuário específico
GET https://api-cal-app.mimenl.easypanel.host/users/1

# Exemplo de resposta
curl https://api-cal-app.mimenl.easypanel.host/users/1
```

#### **4. Tipos de Eventos**
```bash
# Listar todos os tipos de eventos
GET https://api-cal-app.mimenl.easypanel.host/event-types

# Obter tipo de evento específico
GET https://api-cal-app.mimenl.easypanel.host/event-types/1

# Criar novo tipo de evento
POST https://api-cal-app.mimenl.easypanel.host/event-types
Content-Type: application/json

{
  "title": "Consulta Médica",
  "slug": "consulta-medica",
  "length": 30,
  "description": "Consulta médica de 30 minutos",
  "hidden": false,
  "userId": 1
}
```

#### **5. Agendamentos**
```bash
# Listar agendamentos de um usuário
GET https://api-cal-app.mimenl.easypanel.host/bookings/user/1

# Criar novo agendamento
POST https://api-cal-app.mimenl.easypanel.host/bookings
Content-Type: application/json

{
  "userId": 1,
  "eventTypeId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "title": "Consulta com Dr. Silva",
  "description": "Consulta de rotina"
}

# Atualizar agendamento
PUT https://api-cal-app.mimenl.easypanel.host/bookings/{uid}
Content-Type: application/json

{
  "title": "Consulta Atualizada",
  "description": "Nova descrição"
}

# Cancelar agendamento
DELETE https://api-cal-app.mimenl.easypanel.host/bookings/{uid}
```

## 🔧 Configuração no Easy Panel

### **1. Configurar Domínio Personalizado**

#### **Opção A: Usar Domínio Padrão**
- ✅ Já configurado: `api-cal-app.mimenl.easypanel.host`
- ✅ Funciona imediatamente após o deploy

#### **Opção B: Domínio Personalizado**
1. **No Easy Panel**:
   - Vá para "Settings" > "Domain"
   - Adicione seu domínio personalizado
   - Exemplo: `api.seudominio.com`

2. **Configurar DNS**:
   ```
   Tipo: CNAME
   Nome: api
   Valor: api-cal-app.mimenl.easypanel.host
   ```

### **2. Configurar SSL/HTTPS**
- ✅ **Automático**: Easy Panel configura SSL automaticamente
- ✅ **Let's Encrypt**: Certificado gratuito
- ✅ **Renovação automática**: Certificado renovado automaticamente

## 📱 Exemplos de Uso

### **JavaScript/Fetch**
```javascript
const baseUrl = 'https://api-cal-app.mimenl.easypanel.host';

// Obter informações da API
fetch(`${baseUrl}/`)
  .then(response => response.json())
  .then(data => console.log(data));

// Criar agendamento
fetch(`${baseUrl}/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 1,
    eventTypeId: 1,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:30:00Z',
    title: 'Consulta Médica',
    description: 'Consulta de rotina'
  })
})
.then(response => response.json())
.then(data => console.log('Agendamento criado:', data));
```

### **cURL**
```bash
# Testar API
curl https://api-cal-app.mimenl.easypanel.host/

# Health check
curl https://api-cal-app.mimenl.easypanel.host/health

# Listar tipos de eventos
curl https://api-cal-app.mimenl.easypanel.host/event-types

# Criar agendamento
curl -X POST https://api-cal-app.mimenl.easypanel.host/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "title": "Consulta Médica",
    "description": "Consulta de rotina"
  }'
```

### **Python/Requests**
```python
import requests

base_url = 'https://api-cal-app.mimenl.easypanel.host'

# Obter informações da API
response = requests.get(f'{base_url}/')
print(response.json())

# Criar agendamento
booking_data = {
    'userId': 1,
    'eventTypeId': 1,
    'startTime': '2024-01-15T10:00:00Z',
    'endTime': '2024-01-15T10:30:00Z',
    'title': 'Consulta Médica',
    'description': 'Consulta de rotina'
}

response = requests.post(f'{base_url}/bookings', json=booking_data)
print(response.json())
```

## 🔍 Testando as URLs

### **1. Teste Básico**
```bash
# Verificar se a API está funcionando
curl https://api-cal-app.mimenl.easypanel.host/health
```

### **2. Teste de Endpoints**
```bash
# Listar todos os tipos de eventos
curl https://api-cal-app.mimenl.easypanel.host/event-types

# Listar agendamentos do usuário 1
curl https://api-cal-app.mimenl.easypanel.host/bookings/user/1
```

### **3. Teste de Criação**
```bash
# Criar um tipo de evento
curl -X POST https://api-cal-app.mimenl.easypanel.host/event-types \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "slug": "teste",
    "length": 30,
    "description": "Evento de teste",
    "hidden": false,
    "userId": 1
  }'
```

## 🚨 Troubleshooting

### **Problemas Comuns:**

#### **1. Erro 404 - Not Found**
- ✅ Verifique se a URL está correta
- ✅ Confirme se o endpoint existe
- ✅ Verifique se o método HTTP está correto

#### **2. Erro 500 - Internal Server Error**
- ✅ Verifique os logs no Easy Panel
- ✅ Confirme se o banco de dados está conectado
- ✅ Verifique se as variáveis de ambiente estão configuradas

#### **3. Erro de CORS**
- ✅ O middleware CORS já está configurado
- ✅ Verifique se está fazendo requisições do mesmo domínio

#### **4. Timeout**
- ✅ Verifique se o servidor está rodando
- ✅ Confirme se a porta está correta
- ✅ Verifique se não há problemas de rede

## 📊 Monitoramento

### **URLs de Monitoramento:**
- **Health Check**: `https://api-cal-app.mimenl.easypanel.host/health`
- **API Info**: `https://api-cal-app.mimenl.easypanel.host/`

### **Métricas Importantes:**
- ✅ **Uptime**: Tempo de funcionamento
- ✅ **Response Time**: Tempo de resposta
- ✅ **Error Rate**: Taxa de erros
- ✅ **Database Status**: Status do banco de dados

## 🎉 URLs Funcionando!

Após o deploy, todas essas URLs estarão funcionando:

- ✅ `https://api-cal-app.mimenl.easypanel.host/`
- ✅ `https://api-cal-app.mimenl.easypanel.host/health`
- ✅ `https://api-cal-app.mimenl.easypanel.host/bookings`
- ✅ `https://api-cal-app.mimenl.easypanel.host/event-types`
- ✅ `https://api-cal-app.mimenl.easypanel.host/users`

**Teste as URLs após o deploy! 🚀**
