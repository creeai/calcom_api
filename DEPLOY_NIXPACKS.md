# 🚀 Deploy com GitHub + Nixpacks - Easy Panel

## 📋 Configuração para Nixpacks

### ✅ Pré-requisitos
- ✅ Código no GitHub: https://github.com/creeai/calcom_api
- ✅ Branch master atualizada
- ✅ package.json configurado
- ✅ Variáveis de ambiente documentadas

## 🎯 Passo a Passo para Deploy

### 1. Acesse o Easy Panel
1. Vá para: https://easypanel.io (ou seu painel)
2. Faça login na sua conta
3. Clique em **"New Project"** ou **"Novo Projeto"**

### 2. Configurar o Projeto
1. **Nome do Projeto**: `calcom-api`
2. **Tipo**: Selecione **"Application"** ou **"App"**
3. **Descrição**: "API REST para sistema de agendamentos Cal.com"

### 3. Configurar Fonte GitHub
1. **Source**: Selecione **"GitHub"**
2. **Repository**: `creeai/calcom_api`
3. **Branch**: `master`
4. **Build Pack**: Selecione **"Nixpacks"** (ou deixe automático)

### 4. Configurar Build Settings
1. **Build Command**: Deixe vazio (Nixpacks detecta automaticamente)
2. **Start Command**: Deixe vazio (Nixpacks detecta automaticamente)
3. **Root Directory**: Deixe vazio (raiz do projeto)

### 5. Configurar Variáveis de Ambiente
Adicione estas variáveis no Easy Panel:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

**⚠️ IMPORTANTE**: Substitua pelos dados reais do seu banco PostgreSQL.

### 6. Configurar Porta e Domínio
- **Porta**: `3000` (Nixpacks detecta automaticamente do package.json)
- **Domínio**: Configure seu domínio (opcional)

### 7. Deploy
1. Clique em **"Deploy"** ou **"Deployar"**
2. Aguarde o build (pode levar 2-5 minutos)
3. Monitore os logs durante o build

## 🔧 Configurações Específicas para Nixpacks

### package.json Otimizado
O Nixpacks detecta automaticamente:
- **Node.js version**: Pelo campo `engines` no package.json
- **Dependencies**: Pelo campo `dependencies`
- **Start command**: Pelo campo `scripts.start`
- **Port**: Pela variável `PORT` ou porta padrão

### Variáveis de Ambiente Obrigatórias
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### Health Check
O Nixpacks automaticamente:
- ✅ Detecta que é uma aplicação Node.js
- ✅ Instala dependências com `npm install`
- ✅ Executa `npm start`
- ✅ Expõe a porta configurada

## 🗄️ Configuração do Banco de Dados

### Opção 1: Banco Externo (Recomendado)
Use um destes serviços:

#### Supabase (Gratuito)
1. Acesse: https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String
5. Use como DATABASE_URL

#### Railway (Gratuito)
1. Acesse: https://railway.app
2. Crie um novo projeto PostgreSQL
3. Copie a Connection String
4. Use como DATABASE_URL

#### PlanetScale (Gratuito)
1. Acesse: https://planetscale.com
2. Crie um novo banco
3. Copie a Connection String
4. Use como DATABASE_URL

### Opção 2: Banco no Easy Panel
1. Crie um serviço PostgreSQL separado no Easy Panel
2. Use o nome do serviço como host na DATABASE_URL

### Scripts SQL para Criar Tabelas
Execute estes comandos no seu banco PostgreSQL:

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

## ✅ Verificação do Deploy

### 1. Health Check
Teste o endpoint de saúde:
```bash
curl http://seu-dominio:porta/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"
}
```

### 2. API Root
Teste o endpoint raiz:
```bash
curl http://seu-dominio:porta/
```

### 3. Logs
Verifique os logs no Easy Panel para:
- ✅ Build bem-sucedido
- ✅ Dependências instaladas
- ✅ Servidor iniciado
- ✅ Conexão com banco de dados
- ✅ Health check funcionando

## 🔧 Troubleshooting

### Problemas Comuns:

#### 1. Erro de Build
**Sintomas**: Build falha no Nixpacks
**Solução**: 
- Verifique os logs de build
- Confirme se o package.json está correto
- Verifique se todas as dependências estão listadas

#### 2. Erro de Conexão com Banco
**Sintomas**: Health check retorna "database": "disconnected"
**Solução**:
- Verifique se a DATABASE_URL está correta
- Confirme se o banco está acessível
- Verifique se as tabelas foram criadas

#### 3. Erro de Porta
**Sintomas**: Aplicação não responde
**Solução**:
- Confirme se a variável PORT está configurada
- Verifique se o HOST está configurado como 0.0.0.0

#### 4. Erro de Dependências
**Sintomas**: Erro ao instalar dependências
**Solução**:
- Verifique se o package.json está correto
- Confirme se todas as dependências estão listadas
- Verifique se não há conflitos de versão

## 📊 Vantagens do Nixpacks

### ✅ Automático
- Detecta automaticamente o tipo de aplicação
- Instala dependências automaticamente
- Configura porta automaticamente
- Executa comandos automaticamente

### ✅ Otimizado
- Build mais rápido que Docker
- Cache inteligente de dependências
- Otimizações específicas para Node.js
- Menor uso de recursos

### ✅ Simples
- Menos configuração necessária
- Menos arquivos para manter
- Deploy mais direto
- Menos pontos de falha

## 🔄 Atualizações

### Para atualizar a aplicação:
1. Faça mudanças no código
2. Commit e push para o GitHub
3. No Easy Panel, clique em **"Redeploy"**
4. Aguarde o novo build

### Para rollback:
1. No Easy Panel, vá para **"Deployments"**
2. Selecione uma versão anterior
3. Clique em **"Rollback"**

## 🎉 Deploy Concluído!

Após seguir todos os passos, sua API estará rodando em produção no Easy Panel usando Nixpacks!

### Endpoints Disponíveis:
- `GET /` - Informações da API
- `GET /health` - Status da aplicação
- `GET /users/:userId` - Dados do usuário
- `GET /event-types` - Listar tipos de eventos
- `POST /bookings` - Criar agendamento
- E todos os outros endpoints CRUD

### Próximos Passos:
1. ✅ Teste todos os endpoints
2. ✅ Configure monitoramento
3. ✅ Configure backup do banco
4. ✅ Configure domínio personalizado (opcional)
5. ✅ Configure SSL/HTTPS (opcional)

## 🆚 Nixpacks vs Docker Compose

| Aspecto | Nixpacks | Docker Compose |
|---------|----------|----------------|
| **Configuração** | Automática | Manual |
| **Velocidade** | Mais rápido | Mais lento |
| **Complexidade** | Simples | Complexa |
| **Controle** | Limitado | Total |
| **Manutenção** | Fácil | Difícil |
| **Ideal para** | Aplicações simples | Aplicações complexas |
