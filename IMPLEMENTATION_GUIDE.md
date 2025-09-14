# 🚀 Guia Completo de Implementação - Cal.com API

## 📋 Visão Geral

Este guia fornece instruções passo a passo para implementar a API Cal.com com suporte a rotas customizadas, exploração de banco de dados e funcionalidades completas de usuários, agendamentos e tipos de eventos.

## 🎯 Funcionalidades Implementadas

- ✅ **API REST completa** para Cal.com (42 endpoints)
- ✅ **Rotas customizadas** via variáveis de ambiente
- ✅ **Exploração de banco de dados** existente
- ✅ **CRUD completo** para usuários, agendamentos e tipos de eventos
- ✅ **Filtros e paginação** avançados
- ✅ **Deploy no Easy Panel** com Nixpacks
- ✅ **Documentação completa** com exemplos
- ✅ **Formato estruturado** para disponibilidade
- ✅ **Endpoints de debug** para diagnóstico
- ✅ **Documentação Swagger/OpenAPI** completa

## 📁 Estrutura do Projeto

```
calcom-API/
├── 📄 index.js                    # Servidor principal
├── 📄 db.js                       # Configuração do banco
├── 📄 package.json                # Dependências e scripts
├── 📄 .env.example                # Variáveis de ambiente
├── 📄 Dockerfile                  # Container Docker
├── 📄 docker-compose.yml          # Desenvolvimento local
├── 📄 docker-compose.prod.yml     # Produção
├── 📁 routes/                     # Rotas da API (42 endpoints)
│   ├── 📄 users.js                # API de usuários (6 endpoints)
│   ├── 📄 bookings.js             # API de agendamentos (4 endpoints)
│   ├── 📄 eventTypes.js           # API de tipos de eventos (5 endpoints)
│   ├── 📄 availability.js         # API de disponibilidade (9 endpoints)
│   ├── 📄 schedules.js            # API de schedules (8 endpoints)
│   ├── 📄 slots.js                # API de slots (3 endpoints)
│   ├── 📄 teams.js                # API de teams (7 endpoints)
│   ├── 📄 memberships.js          # API de memberships (8 endpoints)
│   ├── 📄 setup.js                # Setup do banco (3 endpoints)
│   └── 📄 explore.js              # Exploração do banco (6 endpoints)
├── 📁 middleware/                 # Middlewares
│   ├── 📄 subdomain.js            # Detecção de subdomínios
│   └── 📄 redirect.js             # Redirecionamento de rotas
├── 📁 database/                   # Scripts SQL
│   └── 📄 schema.sql              # Schema do banco
├── 📄 swagger.yaml                # Documentação Swagger/OpenAPI
└── 📁 docs/                       # Documentação
    ├── 📄 README.md
    ├── 📄 API_DOCUMENTATION.md    # Documentação completa da API
    ├── 📄 IMPLEMENTATION_GUIDE.md # Este guia
    ├── 📄 DEPLOY_EASYPANEL.md
    ├── 📄 DEPLOY_NIXPACKS.md
    ├── 📄 CUSTOM_ROUTES.md
    ├── 📄 USERS_API.md
    ├── 📄 SWAGGER_README.md
    └── 📄 DATABASE_SETUP.md
```

## 🛠️ Passo 1: Preparação do Ambiente

### **1.1 Pré-requisitos**
- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL (banco Cal.com existente)
- Conta no Easy Panel
- Conta no GitHub

### **1.2 Clone do Repositório**
```bash
git clone https://github.com/creeai/calcom_api.git
cd calcom_api
```

### **1.3 Instalação de Dependências**
```bash
npm install
```

### **1.4 Configuração de Variáveis de Ambiente**
Crie um arquivo `.env` baseado no `.env.example`:

```env
# Configurações do Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host:porta/database

# Configurações do Servidor
PORT=3000
NODE_ENV=development
HOST=0.0.0.0

# Configurações de Rotas Customizadas
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

## 🗄️ Passo 2: Configuração do Banco de Dados

### **2.1 Verificar Conexão**
```bash
# Teste local
npm start
```

### **2.2 Explorar Banco Existente**
```bash
# Listar todas as tabelas
curl http://localhost:3000/explore/tables

# Ver estrutura da tabela users
curl http://localhost:3000/explore/table/users

# Ver amostra de dados
curl http://localhost:3000/explore/table/users/sample?limit=5
```

### **2.3 Principais Tabelas Identificadas**
- **`users`** - Usuários do sistema
- **`Booking`** - Agendamentos
- **`EventType`** - Tipos de eventos
- **`Team`** - Equipes
- **`Membership`** - Membros de equipes

## 🚀 Passo 3: Deploy no Easy Panel

### **3.1 Preparação do Repositório**
```bash
# Commit das mudanças
git add .
git commit -m "feat: implementação completa da API Cal.com"
git push origin master
```

### **3.2 Configuração no Easy Panel**

#### **3.2.1 Criar Novo Projeto**
1. Acesse o Easy Panel
2. Clique em **"New Project"**
3. Nome: `calcom-api`
4. Tipo: **"Application"**

#### **3.2.2 Configurar Fonte**
1. **Source**: GitHub
2. **Repository**: `creeai/calcom_api`
3. **Branch**: `master`
4. **Build Pack**: Nixpacks

#### **3.2.3 Variáveis de Ambiente**
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

#### **3.2.4 Deploy**
1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Verifique os logs

## 🧪 Passo 4: Testes e Verificação

### **4.1 Teste de Conectividade**
```bash
# Health check
curl https://seu-dominio.com/health

# Informações da API
curl https://seu-dominio.com/
```

### **4.2 Teste de Usuários**
```bash
# Listar usuários
curl https://seu-dominio.com/user

# Buscar por email
curl https://seu-dominio.com/user/email/usuario@exemplo.com

# Buscar por ID
curl https://seu-dominio.com/user/1
```

### **4.3 Teste de Agendamentos**
```bash
# Listar agendamentos de um usuário
curl https://seu-dominio.com/booking/user/1

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
```

### **4.4 Teste de Tipos de Eventos**
```bash
# Listar tipos de eventos
curl https://seu-dominio.com/event-types

# Obter tipo específico
curl https://seu-dominio.com/event-types/1
```

## 🔧 Passo 5: Configurações Avançadas

### **5.1 Rotas Customizadas**

#### **Configuração Padrão:**
```env
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
```

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

### **5.2 Filtros e Paginação**

#### **Usuários com Filtros:**
```bash
# Filtrar por email
curl https://seu-dominio.com/user?email=gmail

# Filtrar por nome
curl https://seu-dominio.com/user?name=Silva

# Paginação
curl https://seu-dominio.com/user?page=1&limit=10

# Ordenação
curl https://seu-dominio.com/user?sortBy=name&sortOrder=ASC

# Combinação
curl https://seu-dominio.com/user?email=gmail&page=1&limit=5&sortBy=created_at&sortOrder=DESC
```

### **5.3 Exploração de Banco**

#### **Endpoints de Exploração:**
```bash
# Listar tabelas
curl https://seu-dominio.com/explore/tables

# Estrutura de tabela
curl https://seu-dominio.com/explore/table/users

# Amostra de dados
curl https://seu-dominio.com/explore/table/users/sample?limit=5

# Buscar tabelas de usuários
curl https://seu-dominio.com/explore/search/users

# Buscar tabelas de eventos
curl https://seu-dominio.com/explore/search/events

# Informações do banco
curl https://seu-dominio.com/explore/info
```

## 📱 Passo 6: Integração com Frontend

### **6.1 JavaScript/Fetch**
```javascript
const baseUrl = 'https://seu-dominio.com';

// Listar usuários
async function getUsers() {
  const response = await fetch(`${baseUrl}/user`);
  const data = await response.json();
  return data.users;
}

// Buscar usuário por email
async function getUserByEmail(email) {
  const response = await fetch(`${baseUrl}/user/email/${email}`);
  return await response.json();
}

// Criar agendamento
async function createBooking(bookingData) {
  const response = await fetch(`${baseUrl}/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
  });
  return await response.json();
}
```

### **6.2 Python/Requests**
```python
import requests

base_url = 'https://seu-dominio.com'

# Listar usuários
def get_users():
    response = requests.get(f'{base_url}/user')
    return response.json()

# Buscar usuário por email
def get_user_by_email(email):
    response = requests.get(f'{base_url}/user/email/{email}')
    return response.json()

# Criar agendamento
def create_booking(booking_data):
    response = requests.post(f'{base_url}/booking', json=booking_data)
    return response.json()
```

## 🔍 Passo 7: Monitoramento e Troubleshooting

### **7.1 Logs Importantes**
- ✅ Build bem-sucedido
- ✅ Conexão com banco de dados
- ✅ Servidor rodando na porta 3000
- ✅ Health check funcionando

### **7.2 Problemas Comuns**

#### **Erro: "relation does not exist"**
- ✅ Verifique se está usando `users` (não `User`)
- ✅ Confirme se a `DATABASE_URL` está correta
- ✅ Use `/explore/tables` para ver tabelas disponíveis

#### **Erro de Conexão com Banco**
- ✅ Verifique se a `DATABASE_URL` está correta
- ✅ Confirme se o banco está acessível
- ✅ Teste com `/health` endpoint

#### **Rotas não funcionam**
- ✅ Verifique se as variáveis de ambiente estão configuradas
- ✅ Confirme se o middleware de redirecionamento está ativo
- ✅ Teste com logs habilitados

### **7.3 URLs de Monitoramento**
- **Health Check**: `https://seu-dominio.com/health`
- **API Info**: `https://seu-dominio.com/`
- **Exploração**: `https://seu-dominio.com/explore/tables`

## 📊 Passo 8: Endpoints Disponíveis

### **8.1 Usuários**
```bash
GET    /user                    # Listar usuários (com filtros)
GET    /user/email/{email}      # Buscar por email
GET    /user/{id}               # Buscar por ID
POST   /user                    # Criar usuário
PUT    /user/{id}               # Atualizar usuário
DELETE /user/{id}               # Deletar usuário
```

### **8.2 Agendamentos**
```bash
GET    /booking/user/{userId}   # Listar agendamentos do usuário
POST   /booking                 # Criar agendamento
PUT    /booking/{uid}           # Atualizar agendamento
DELETE /booking/{uid}           # Cancelar agendamento
```

### **8.3 Tipos de Eventos**
```bash
GET    /event-types             # Listar tipos de eventos
GET    /event-types/{id}        # Obter tipo específico
POST   /event-types             # Criar tipo de evento
PUT    /event-types/{id}        # Atualizar tipo de evento
DELETE /event-types/{id}        # Deletar tipo de evento
```

### **8.4 Sistema**
```bash
GET    /                        # Informações da API
GET    /health                  # Status da aplicação
GET    /explore/tables          # Listar tabelas do banco
GET    /explore/table/{name}    # Estrutura de tabela
```

## 🎉 Passo 9: Conclusão

### **9.1 Checklist Final**
- ✅ Código no GitHub
- ✅ Deploy no Easy Panel
- ✅ Banco de dados conectado
- ✅ Rotas customizadas funcionando
- ✅ Endpoints testados
- ✅ Documentação completa

### **9.2 Próximos Passos**
1. **Monitoramento**: Configure alertas e logs
2. **Backup**: Configure backup do banco
3. **Segurança**: Implemente autenticação se necessário
4. **Performance**: Otimize queries se necessário
5. **Expansão**: Adicione novos endpoints conforme necessário

### **9.3 Suporte**
- **Documentação**: Todos os arquivos `.md` no projeto
- **Logs**: Verifique logs no Easy Panel
- **Exploração**: Use endpoints `/explore/*` para investigar
- **Health Check**: Use `/health` para verificar status

## 📚 Recursos Adicionais

### **Arquivos de Documentação:**
- `README.md` - Visão geral do projeto
- `DEPLOY_EASYPANEL.md` - Deploy no Easy Panel
- `CUSTOM_ROUTES.md` - Rotas customizadas
- `USERS_API.md` - API de usuários
- `DATABASE_SETUP.md` - Setup do banco
- `DOMAIN_CONFIG.md` - Configuração de domínios

### **Scripts Úteis:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Docker
npm run docker:build
npm run docker:run
npm run docker:compose
```

**🎯 Implementação Completa! Sua API Cal.com está funcionando perfeitamente! 🚀**
