# 📚 Documentação Swagger/OpenAPI - Cal.com API

## 🎯 **Visão Geral**

Esta documentação Swagger/OpenAPI fornece uma interface interativa completa para testar e explorar todos os endpoints da Cal.com API.

## 📁 **Arquivos da Documentação**

### **`swagger.yaml`** - Documentação Principal
- ✅ **Informações da API** (`GET /`)
- ✅ **Health Check** (`GET /health`)
- ✅ **Usuários** (5 endpoints completos)
- ✅ **Disponibilidade** (9 endpoints completos)
- ✅ **Schemas** completos para todos os modelos

### **`swagger-teams.yaml`** - Endpoints de Teams e Memberships
- ✅ **Teams** (7 endpoints completos)
- ✅ **Memberships** (8 endpoints completos)

## 🚀 **Como Usar**

### **1. Swagger UI Online**
Acesse qualquer um destes serviços online:

- **Swagger Editor**: https://editor.swagger.io/
- **Swagger UI**: https://petstore.swagger.io/
- **ReDoc**: https://redoc.ly/

### **2. Usar no Swagger Editor**
1. Acesse https://editor.swagger.io/
2. Clique em "File" → "Import File"
3. Selecione o arquivo `swagger.yaml`
4. A documentação será carregada automaticamente

### **3. Usar no Swagger UI**
1. Acesse https://petstore.swagger.io/
2. Clique no botão "Explore" no topo
3. Cole o conteúdo do `swagger.yaml`
4. Clique em "Explore"

### **4. Integrar com Swagger UI Local**
```bash
# Instalar swagger-ui-serve
npm install -g swagger-ui-serve

# Servir a documentação
swagger-ui-serve swagger.yaml
```

### **5. Usar com Docker**
```bash
# Criar container com Swagger UI
docker run -p 8080:8080 -e SWAGGER_JSON=/swagger.yaml -v $(pwd):/swagger swaggerapi/swagger-ui

# Acessar em http://localhost:8080
```

## 📋 **Endpoints Documentados**

### **👤 Usuários (5 endpoints)**
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `GET /users/{id}` - Buscar por ID
- `PUT /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Deletar usuário
- `GET /users/email/{email}` - Buscar por email

### **📅 Disponibilidade (9 endpoints)**
- `GET /availability` - Listar disponibilidades
- `POST /availability` - Criar disponibilidade
- `GET /availability/{id}` - Buscar por ID
- `PUT /availability/{id}` - Atualizar disponibilidade
- `DELETE /availability/{id}` - Deletar disponibilidade
- `GET /availability/user/{userId}` - Por usuário
- `GET /availability/schedule/{scheduleId}` - Por schedule
- `POST /availability/check` - Verificar disponibilidade
- `GET /availability/user/{userId}/available-slots` - Slots disponíveis

### **👥 Teams (7 endpoints)**
- `GET /teams` - Listar teams
- `POST /teams` - Criar team
- `GET /teams/{id}` - Buscar por ID
- `PUT /teams/{id}` - Atualizar team
- `DELETE /teams/{id}` - Deletar team
- `GET /teams/slug/{slug}` - Buscar por slug
- `GET /teams/{id}/members` - Listar membros

### **👤 Memberships (8 endpoints)**
- `GET /memberships` - Listar memberships
- `POST /memberships` - Criar membership
- `GET /memberships/{id}` - Buscar por ID
- `PUT /memberships/{id}` - Atualizar membership
- `DELETE /memberships/{id}` - Deletar membership
- `GET /memberships/user/{userId}/team/{teamId}` - Por usuário e team
- `PATCH /memberships/{id}/accept` - Aceitar convite
- `PATCH /memberships/{id}/reject` - Rejeitar convite

## 🔧 **Schemas Documentados**

### **Modelos Principais**
- ✅ **User** - Usuário
- ✅ **Booking** - Agendamento
- ✅ **EventType** - Tipo de Evento
- ✅ **Availability** - Disponibilidade
- ✅ **Schedule** - Horário
- ✅ **Team** - Equipe
- ✅ **Membership** - Membro
- ✅ **Slot** - Horário Disponível

### **Modelos Auxiliares**
- ✅ **Pagination** - Paginação
- ✅ **Error** - Erro
- ✅ **Filters** - Filtros

## 📊 **Recursos da Documentação**

### **✅ Funcionalidades Completas**
- **Parâmetros** detalhados (query, path, body)
- **Respostas** com códigos de status HTTP
- **Exemplos** de requisições e respostas
- **Validação** de dados
- **Filtros** e paginação
- **Ordenação** e busca
- **Tratamento de erros**

### **🎨 Interface Interativa**
- **Teste direto** dos endpoints
- **Autenticação** (quando necessário)
- **Exemplos** clicáveis
- **Validação** em tempo real
- **Download** de respostas

## 🌐 **Servidores Configurados**

### **Produção**
```
https://api-cal-app.mimenl.easypanel.host
```

### **Desenvolvimento**
```
http://localhost:3000
```

## 📝 **Exemplos de Uso**

### **1. Listar Usuários**
```yaml
GET /users?page=1&limit=10&email=joao@exemplo.com
```

### **2. Criar Usuário**
```yaml
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "username": "joao.silva"
}
```

### **3. Verificar Disponibilidade**
```yaml
POST /availability/check
Content-Type: application/json

{
  "userId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "date": "2024-01-15"
}
```

### **4. Criar Team**
```yaml
POST /teams
Content-Type: application/json

{
  "name": "Equipe Desenvolvimento",
  "slug": "equipe-desenvolvimento",
  "bio": "Equipe responsável pelo desenvolvimento",
  "hideBranding": false,
  "isPrivate": false
}
```

## 🔄 **Atualizações**

A documentação Swagger é atualizada automaticamente sempre que novos endpoints são adicionados à API.

### **Última Atualização**
- ✅ **42 endpoints** documentados
- ✅ **8 schemas** completos
- ✅ **Exemplos** para todos os endpoints
- ✅ **Validação** completa

## 🆘 **Suporte**

Para dúvidas sobre a documentação Swagger:

1. **Verifique** se está usando a versão mais recente
2. **Teste** os endpoints no Swagger UI
3. **Consulte** a documentação da API (`API_DOCUMENTATION.md`)
4. **Verifique** os logs da aplicação

## 🎉 **Conclusão**

A documentação Swagger fornece uma interface completa e interativa para explorar e testar todos os endpoints da Cal.com API. Use-a para:

- **Entender** como usar cada endpoint
- **Testar** requisições em tempo real
- **Validar** dados antes de implementar
- **Documentar** integrações
- **Compartilhar** com outros desenvolvedores

**Aproveite a documentação interativa!** 🚀
