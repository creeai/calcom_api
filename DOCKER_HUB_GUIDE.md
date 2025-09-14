# 🐳 Guia para Build e Push da Imagem para Docker Hub

## 📋 Pré-requisitos

- Docker instalado e funcionando
- Conta no Docker Hub (https://hub.docker.com)
- Acesso ao terminal/PowerShell

## 🚀 Passo a Passo

### **1. Criar Conta no Docker Hub**

1. Acesse https://hub.docker.com
2. Clique em "Sign Up"
3. Crie sua conta
4. Anote seu **username** do Docker Hub

### **2. Preparar os Arquivos**

Certifique-se de que você tem os seguintes arquivos:
- `Dockerfile.production`
- `package.json`
- `index.js`
- `db.js`
- `routes/` (pasta completa)
- `middleware/` (pasta completa)

### **3. Executar o Build e Push**

#### **Opção A: Script Automático (Recomendado)**

**Para Windows (PowerShell):**
```powershell
# Substitua "seuusuario" pelo seu username do Docker Hub
.\build-and-push.ps1 "v1.0.0" "seuusuario"
```

**Para Linux/Mac:**
```bash
# Torne o script executável
chmod +x build-and-push.sh

# Execute o script
./build-and-push.sh "v1.0.0" "seuusuario"
```

#### **Opção B: Comandos Manuais**

```bash
# 1. Login no Docker Hub
docker login

# 2. Build da imagem
docker build -f Dockerfile.production -t seuusuario/calcom-api:v1.0.0 .

# 3. Tag para latest
docker tag seuusuario/calcom-api:v1.0.0 seuusuario/calcom-api:latest

# 4. Push da imagem
docker push seuusuario/calcom-api:v1.0.0
docker push seuusuario/calcom-api:latest
```

### **4. Verificar no Docker Hub**

1. Acesse https://hub.docker.com
2. Faça login
3. Vá para "Repositories"
4. Verifique se a imagem `calcom-api` foi criada

## 🌐 Usando a Imagem

### **No Docker Compose:**

```yaml
services:
  calcom-api:
    image: seuusuario/calcom-api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:senha@postgres:5432/calcom_pdv
    ports:
      - "3000:3000"
```

### **Comando Docker:**

```bash
# Pull da imagem
docker pull seuusuario/calcom-api:latest

# Executar container
docker run -d \
  --name calcom-api \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:senha@host:5432/calcom_pdv \
  seuusuario/calcom-api:latest
```

## 📊 Informações da Imagem

### **Tamanho:**
- **Imagem base**: Node.js 18 Alpine (~40MB)
- **Com dependências**: ~150MB
- **Total**: ~200MB

### **Portas:**
- **3000**: API HTTP

### **Variáveis de Ambiente:**
```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://user:pass@host:port/db
BOOKING_ROUTE=/booking
EVENT_TYPE_ROUTE=/event-types
USER_ROUTE=/user
HEALTH_ROUTE=/health
ROOT_ROUTE=/
```

## 🔧 Comandos Úteis

### **Verificar Imagens Locais:**
```bash
docker images | grep calcom-api
```

### **Verificar Imagens no Hub:**
```bash
docker search seuusuario/calcom-api
```

### **Testar a Imagem:**
```bash
# Executar em modo interativo
docker run -it --rm seuusuario/calcom-api:latest sh

# Verificar logs
docker logs <container_id>
```

### **Remover Imagens Locais:**
```bash
# Remover imagem específica
docker rmi seuusuario/calcom-api:v1.0.0

# Remover todas as imagens calcom-api
docker rmi $(docker images "seuusuario/calcom-api" -q)
```

## 🏷️ Versionamento

### **Estratégia de Tags:**
- `latest`: Versão mais recente
- `v1.0.0`: Versão específica
- `v1.0.0-alpine`: Versão com sistema específico

### **Exemplo de Versionamento:**
```bash
# Versão inicial
./build-and-push.sh "v1.0.0" "seuusuario"

# Atualização
./build-and-push.sh "v1.0.1" "seuusuario"

# Versão latest
./build-and-push.sh "latest" "seuusuario"
```

## 🛠️ Troubleshooting

### **Erro: "denied: requested access to the resource is denied"**
```bash
# Verificar se está logado
docker login

# Verificar username
docker info | grep Username
```

### **Erro: "no space left on device"**
```bash
# Limpar imagens não utilizadas
docker system prune -a

# Verificar espaço
docker system df
```

### **Erro: "build failed"**
```bash
# Verificar Dockerfile
cat Dockerfile.production

# Build com logs detalhados
docker build --no-cache -f Dockerfile.production -t test .
```

## 📋 Checklist

- [ ] Conta criada no Docker Hub
- [ ] Docker instalado e funcionando
- [ ] Arquivos da aplicação prontos
- [ ] Script de build executado
- [ ] Imagem enviada com sucesso
- [ ] Imagem verificada no Docker Hub
- [ ] Teste de pull da imagem funcionando

## 🎯 Próximos Passos

1. **Atualizar docker-compose** para usar a imagem do Hub
2. **Configurar CI/CD** para builds automáticos
3. **Criar tags** para diferentes versões
4. **Documentar** no README do repositório

**Pronto! Sua imagem está no Docker Hub!** 🎉
