# Cal.com API

API REST completa para sistema de agendamentos baseado no Cal.com, desenvolvida com Node.js, Express e PostgreSQL.

## 🚀 Funcionalidades

- **42 Endpoints Implementados** cobrindo todas as funcionalidades do Cal.com
- **Gestão de Usuários**: CRUD completo com filtros e paginação
- **Agendamentos**: Sistema completo de agendamentos com debug
- **Tipos de Eventos**: CRUD completo para tipos de eventos
- **Disponibilidade**: Formato estruturado com horários organizados por dias
- **Schedules**: Gestão de horários e disponibilidade
- **Slots**: Horários disponíveis para agendamento
- **Teams**: Gestão de equipes
- **Memberships**: Gestão de membros de equipes
- **Exploração de Banco**: Endpoints para explorar estrutura do banco
- **Banco de Dados**: Integração com PostgreSQL existente do Cal.com
- **Containerização**: Suporte completo ao Docker
- **Deploy**: Pronto para Easy Panel com Nixpacks
- **Documentação**: Swagger/OpenAPI completa

## 📊 Endpoints Disponíveis

### **Total: 42 Endpoints Implementados**

| Categoria | Endpoints | Descrição |
|-----------|-----------|-----------|
| 👤 **Usuários** | 6 | CRUD completo, filtros, paginação |
| 📅 **Agendamentos** | 4 | Listagem, debug, CRUD |
| 🎯 **Tipos de Eventos** | 5 | CRUD completo |
| ⏰ **Disponibilidade** | 9 | Formato estruturado, verificação |
| 📅 **Schedules** | 8 | Gestão de horários |
| ⏰ **Slots** | 3 | Horários disponíveis |
| 👥 **Teams** | 7 | Gestão de equipes |
| 👥 **Memberships** | 8 | Gestão de membros |
| 🔧 **Setup** | 3 | Configuração do banco |
| 🔍 **Exploração** | 6 | Exploração do banco |

### **Principais Endpoints:**
- `GET /` - Informações da API
- `GET /health` - Status da aplicação
- `GET /users` - Lista usuários
- `GET /bookings` - Lista agendamentos
- `GET /availability` - Disponibilidade estruturada
- `GET /teams` - Lista equipes
- `GET /explore/tables` - Explora banco de dados

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 12
- Docker (opcional)

## 🔒 Segurança

- **NUNCA** commite arquivos `.env` para o controle de versão
- Use `env.template` como referência para variáveis de ambiente
- Configure senhas fortes e SSL em produção
- Veja [SECURITY.md](SECURITY.md) para diretrizes detalhadas de segurança

## 🛠️ Instalação

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/calcom-api.git
   cd calcom-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/calcom_db
   PORT=3000
   NODE_ENV=development
   ```

4. **Configure o banco de dados**
   - Crie um banco PostgreSQL
   - Execute os scripts SQL necessários para criar as tabelas

5. **Execute a aplicação**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

### Instalação com Docker

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/calcom-api.git
   cd calcom-api
   ```

2. **Execute com Docker Compose**
   ```bash
   npm run docker:compose
   ```

   Ou manualmente:
   ```bash
   # Build da imagem
   npm run docker:build
   
   # Execute o container
   npm run docker:run
   ```

## 🐳 Deploy no Easy Panel

### Configuração no Easy Panel

1. **Crie um novo projeto** no Easy Panel
2. **Selecione "Docker Compose"** como tipo de projeto
3. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://usuario:senha@host:porta/database
   PORT=3000
   NODE_ENV=production
   ```
4. **Configure o domínio** e porta (3000)
5. **Deploy** o projeto

### Estrutura do Projeto para Easy Panel

O projeto já está configurado com:
- ✅ `Dockerfile` otimizado para produção
- ✅ `docker-compose.yml` para desenvolvimento
- ✅ Variáveis de ambiente configuradas
- ✅ Health check endpoint
- ✅ Configuração de porta dinâmica

## 📚 API Endpoints

### Usuários
- `GET /users/:userId` - Obter informações de um usuário

### Tipos de Eventos
- `GET /event-types` - Listar todos os tipos de eventos
- `GET /event-types/:id` - Obter um tipo de evento específico
- `POST /event-types` - Criar novo tipo de evento
- `PUT /event-types/:id` - Atualizar tipo de evento
- `DELETE /event-types/:id` - Deletar tipo de evento

### Agendamentos
- `GET /bookings/user/:userId` - Listar agendamentos de um usuário
- `POST /bookings` - Criar novo agendamento
- `PUT /bookings/:uid` - Atualizar agendamento
- `DELETE /bookings/:uid` - Cancelar agendamento

### Health Check
- `GET /health` - Verificar status da aplicação

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### User
```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  -- outros campos conforme necessário
);
```

#### EventType
```sql
CREATE TABLE "EventType" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  length INTEGER,
  description TEXT,
  hidden BOOLEAN DEFAULT false,
  userId INTEGER REFERENCES "User"(id)
);
```

#### Booking
```sql
CREATE TABLE "Booking" (
  uid UUID PRIMARY KEY,
  userId INTEGER REFERENCES "User"(id),
  eventTypeId INTEGER REFERENCES "EventType"(id),
  startTime TIMESTAMP,
  endTime TIMESTAMP,
  title VARCHAR(255),
  description TEXT
);
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia a aplicação em produção
- `npm run dev` - Inicia em modo desenvolvimento com nodemon
- `npm run docker:build` - Constrói a imagem Docker
- `npm run docker:run` - Executa o container Docker
- `npm run docker:compose` - Executa com Docker Compose

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | - |
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente de execução | development |

## 📝 Exemplos de Uso

### Criar um Tipo de Evento
```bash
curl -X POST http://localhost:3000/event-types \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Consulta Médica",
    "slug": "consulta-medica",
    "length": 30,
    "description": "Consulta médica de 30 minutos",
    "hidden": false,
    "userId": 1
  }'
```

### Criar um Agendamento
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventTypeId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "title": "Consulta com Dr. Silva",
    "description": "Consulta de rotina"
  }'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão configuradas corretamente
3. Verifique se o banco de dados está rodando e acessível
4. Abra uma issue no GitHub com detalhes do problema

## 🔄 Changelog

### v1.0.0
- ✅ API REST completa
- ✅ Integração com PostgreSQL
- ✅ Containerização com Docker
- ✅ Documentação completa
- ✅ Suporte ao Easy Panel
