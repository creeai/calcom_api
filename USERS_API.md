# 👥 API de Usuários - Funcionalidades Completas

## 📋 Endpoints Disponíveis

### **1. Listar Todos os Usuários (com filtros e paginação)**
```bash
GET /user
```

#### **Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `email` (opcional): Filtrar por email (busca parcial)
- `name` (opcional): Filtrar por nome (busca parcial)
- `sortBy` (opcional): Campo para ordenação (id, name, email, created_at, updated_at)
- `sortOrder` (opcional): Ordem (ASC ou DESC)

#### **Exemplos:**

**Listar todos os usuários:**
```bash
curl https://meudominio.com/user
```

**Listar com paginação:**
```bash
curl https://meudominio.com/user?page=1&limit=5
```

**Filtrar por email:**
```bash
curl https://meudominio.com/user?email=joao
```

**Filtrar por nome:**
```bash
curl https://meudominio.com/user?name=Silva
```

**Ordenar por nome:**
```bash
curl https://meudominio.com/user?sortBy=name&sortOrder=ASC
```

**Combinação de filtros:**
```bash
curl https://meudominio.com/user?email=gmail&name=João&page=1&limit=10&sortBy=created_at&sortOrder=DESC
```

#### **Resposta:**
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
    "name": "João",
    "sortBy": "created_at",
    "sortOrder": "DESC"
  }
}
```

### **2. Buscar Usuário por Email**
```bash
GET /user/email/{email}
```

#### **Exemplo:**
```bash
curl https://meudominio.com/user/email/joao@exemplo.com
```

#### **Resposta:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

### **3. Buscar Usuário por ID**
```bash
GET /user/{id}
```

#### **Exemplo:**
```bash
curl https://meudominio.com/user/1
```

### **4. Criar Novo Usuário**
```bash
POST /user
```

#### **Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com"
}
```

#### **Exemplo:**
```bash
curl -X POST https://meudominio.com/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }'
```

#### **Resposta:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

### **5. Atualizar Usuário**
```bash
PUT /user/{id}
```

#### **Body:**
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@exemplo.com"
}
```

#### **Exemplo:**
```bash
curl -X PUT https://meudominio.com/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "email": "joao.santos@exemplo.com"
  }'
```

### **6. Deletar Usuário**
```bash
DELETE /user/{id}
```

#### **Exemplo:**
```bash
curl -X DELETE https://meudominio.com/user/1
```

#### **Resposta:**
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

## 📱 Exemplos de Uso

### **JavaScript/Fetch:**

#### **Listar todos os usuários:**
```javascript
const baseUrl = 'https://meudominio.com';

// Listar todos os usuários
fetch(`${baseUrl}/user`)
  .then(response => response.json())
  .then(data => {
    console.log('Usuários:', data.users);
    console.log('Paginação:', data.pagination);
  });

// Filtrar por email
fetch(`${baseUrl}/user?email=gmail&limit=5`)
  .then(response => response.json())
  .then(data => console.log(data));

// Buscar usuário por email
fetch(`${baseUrl}/user/email/joao@exemplo.com`)
  .then(response => response.json())
  .then(data => console.log(data));

// Criar novo usuário
fetch(`${baseUrl}/user`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@exemplo.com'
  })
})
.then(response => response.json())
.then(data => console.log('Usuário criado:', data));
```

### **Python/Requests:**

#### **Listar usuários com filtros:**
```python
import requests

base_url = 'https://meudominio.com'

# Listar todos os usuários
response = requests.get(f'{base_url}/user')
data = response.json()
print('Usuários:', data['users'])

# Filtrar por email
response = requests.get(f'{base_url}/user', params={
    'email': 'gmail',
    'page': 1,
    'limit': 10,
    'sortBy': 'name',
    'sortOrder': 'ASC'
})
data = response.json()
print('Usuários filtrados:', data['users'])

# Buscar por email específico
response = requests.get(f'{base_url}/user/email/joao@exemplo.com')
user = response.json()
print('Usuário encontrado:', user)

# Criar novo usuário
new_user = {
    'name': 'João Silva',
    'email': 'joao@exemplo.com'
}
response = requests.post(f'{base_url}/user', json=new_user)
created_user = response.json()
print('Usuário criado:', created_user)
```

## 🔍 Casos de Uso Comuns

### **1. Buscar usuário por email para login:**
```bash
curl https://meudominio.com/user/email/usuario@exemplo.com
```

### **2. Listar usuários com paginação para admin:**
```bash
curl https://meudominio.com/user?page=1&limit=20&sortBy=created_at&sortOrder=DESC
```

### **3. Buscar usuários por domínio de email:**
```bash
curl https://meudominio.com/user?email=@empresa.com
```

### **4. Filtrar usuários por nome:**
```bash
curl https://meudominio.com/user?name=Silva
```

### **5. Verificar se email já existe:**
```bash
curl https://meudominio.com/user/email/novo@exemplo.com
# Retorna 404 se não existir, 200 com dados se existir
```

## ⚠️ Códigos de Erro

### **400 - Bad Request**
- Nome ou email não fornecidos ao criar usuário

### **404 - Not Found**
- Usuário não encontrado por ID ou email

### **409 - Conflict**
- Email já está em uso (ao criar ou atualizar)

### **500 - Internal Server Error**
- Erro interno do servidor

## 🎯 Vantagens da Implementação

### **✅ Funcionalidades Avançadas:**
- **Paginação**: Controle de performance
- **Filtros**: Busca flexível por email e nome
- **Ordenação**: Múltiplos campos de ordenação
- **Busca por email**: Endpoint específico para login

### **✅ Performance:**
- **LIMIT/OFFSET**: Paginação eficiente
- **Índices**: Busca rápida por email
- **Queries otimizadas**: Menos dados transferidos

### **✅ Flexibilidade:**
- **Múltiplos filtros**: Combinação de critérios
- **Ordenação customizada**: Por qualquer campo
- **Busca parcial**: ILIKE para emails e nomes

**Agora você tem uma API completa de usuários com todas as funcionalidades que precisa! 🚀**
