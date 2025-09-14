# 🐳 Guia de Instalação no Portainer - Cal.com API

## 📋 Pré-requisitos

- Docker Swarm configurado
- Portainer instalado e funcionando
- Traefik configurado com Let's Encrypt
- Rede `network_swarm_public` criada

## 🚀 Instalação no Portainer

### **1. Preparar os Arquivos**

1. **Faça upload dos arquivos** para o servidor:
   ```bash
   # Estrutura de arquivos necessária:
   calcom-api/
   ├── docker-compose.portainer.yml
   ├── Dockerfile.production
   ├── portainer-stack.json
   ├── database/
   │   └── init.sql
   ├── routes/
   ├── middleware/
   ├── package.json
   ├── index.js
   └── db.js
   ```

### **2. Criar Stack no Portainer**

1. **Acesse o Portainer**
2. **Vá para Stacks**
3. **Clique em "Add stack"**
4. **Nome da Stack**: `calcom-api`
5. **Cole o conteúdo** do arquivo `docker-compose.portainer.yml`

### **3. Configurar Variáveis de Ambiente**

**Substitua os seguintes valores:**

```yaml
# URLs (substitua pelo seu domínio)
- API_URL=https://api-cal.SEUDOMINIO.com
- NEXT_PUBLIC_WEBAPP_URL=https://api-cal.SEUDOMINIO.com

# Banco de dados (substitua pelas suas credenciais)
- DATABASE_URL=postgresql://postgres:SUASENHA@postgres:5432/calcom_pdv
- POSTGRES_PASSWORD=SUASENHA

# pgAdmin (substitua pelo seu email)
- PGADMIN_DEFAULT_EMAIL=seuemail@seudominio.com
- PGADMIN_DEFAULT_PASSWORD=suasenha
```

### **4. Configurar Traefik Labels**

**Substitua os domínios:**

```yaml
# API
- traefik.http.routers.calcom-api.rule=Host(`api-cal.SEUDOMINIO.com`)

# pgAdmin
- traefik.http.routers.pgadmin.rule=Host(`pgadmin.SEUDOMINIO.com`)
```

### **5. Deploy da Stack**

1. **Clique em "Deploy the stack"**
2. **Aguarde o build** e deploy
3. **Verifique os logs** se houver problemas

## 🌐 URLs Após Deploy

### **API Endpoints:**
- **API Principal**: `https://api-cal.SEUDOMINIO.com`
- **Health Check**: `https://api-cal.SEUDOMINIO.com/health`
- **Documentação**: `https://api-cal.SEUDOMINIO.com/`

### **Gerenciamento:**
- **pgAdmin**: `https://pgadmin.SEUDOMINIO.com`
  - Email: `admin@SEUDOMINIO.com`
  - Senha: `admin123`

## 📊 Recursos Alocados

### **API Cal.com:**
- **CPU**: 0.25 - 0.5 cores
- **RAM**: 256MB - 512MB

### **PostgreSQL:**
- **CPU**: 0.5 - 1 core
- **RAM**: 512MB - 1GB

### **pgAdmin:**
- **CPU**: 0.25 - 0.5 cores
- **RAM**: 256MB - 512MB

## 🔧 Configurações Avançadas

### **1. Backup do Banco de Dados**

```bash
# Backup manual
docker exec -t postgres pg_dump -U postgres calcom_pdv > backup.sql

# Restore
docker exec -i postgres psql -U postgres calcom_pdv < backup.sql
```

### **2. Logs da Aplicação**

```bash
# Ver logs da API
docker service logs calcom-api_calcom-api

# Ver logs do PostgreSQL
docker service logs calcom-api_postgres
```

### **3. Monitoramento**

- **Health Check**: `/health`
- **Métricas**: Logs do Docker
- **Status**: Portainer Dashboard

## 🛠️ Troubleshooting

### **Problema: API não inicia**
```bash
# Verificar logs
docker service logs calcom-api_calcom-api

# Verificar se o banco está rodando
docker service ps calcom-api_postgres
```

### **Problema: Banco não conecta**
```bash
# Verificar se o PostgreSQL está rodando
docker service logs calcom-api_postgres

# Testar conexão
docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d calcom_pdv
```

### **Problema: Traefik não roteia**
- Verificar se a rede `network_swarm_public` existe
- Verificar se o Traefik está rodando
- Verificar se os labels estão corretos

## 📝 Variáveis de Ambiente Completas

```yaml
environment:
  # Aplicação
  - NODE_ENV=production
  - PORT=3000
  - HOST=0.0.0.0
  
  # URLs
  - API_URL=https://api-cal.SEUDOMINIO.com
  
  # Banco de dados
  - DATABASE_URL=postgresql://postgres:SUASENHA@postgres:5432/calcom_pdv
  - DATABASE_DIRECT_URL=postgresql://postgres:SUASENHA@postgres:5432/calcom_pdv
  
  # Rotas customizadas
  - BOOKING_ROUTE=/booking
  - EVENT_TYPE_ROUTE=/event-types
  - USER_ROUTE=/user
  - HEALTH_ROUTE=/health
  - ROOT_ROUTE=/
```

## 🎯 Endpoints Disponíveis

### **Principais:**
- `GET /` - Informações da API
- `GET /health` - Status da aplicação
- `GET /users` - Lista usuários
- `GET /bookings` - Lista agendamentos
- `GET /availability` - Disponibilidade estruturada
- `GET /teams` - Lista equipes

### **Debug:**
- `GET /availability/debug/ids` - IDs disponíveis
- `GET /bookings/debug/table-structure` - Estrutura da tabela
- `GET /explore/tables` - Explorar banco de dados

## ✅ Checklist de Deploy

- [ ] Arquivos enviados para o servidor
- [ ] Stack criada no Portainer
- [ ] Variáveis de ambiente configuradas
- [ ] Domínios configurados no Traefik
- [ ] Deploy executado com sucesso
- [ ] Health check funcionando
- [ ] API respondendo corretamente
- [ ] Banco de dados conectado
- [ ] pgAdmin acessível

**Pronto! Sua API Cal.com está rodando no Portainer!** 🎉
