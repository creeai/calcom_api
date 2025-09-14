# 🚀 Quick Start - Deploy para Docker Hub

## ✅ **Pronto para Deploy!**

### **1. Iniciar Docker Desktop**
- Abra o Docker Desktop
- Aguarde até aparecer "Docker Desktop is running"

### **2. Executar o Script**
```powershell
# Execute no PowerShell como Administrador
.\deploy-to-dockerhub.ps1
```

### **3. O que o Script Faz:**
1. ✅ Verifica se o Docker está rodando
2. 🔐 Faz login no Docker Hub (jhonatancreeai)
3. 🔨 Build da imagem usando Dockerfile.production
4. 🏷️ Cria tag com timestamp
5. 📤 Push para Docker Hub
6. ✅ Confirma sucesso

## 🌐 **Após o Deploy:**

### **Imagens Disponíveis:**
- `jhonatancreeai/calcom:latest`
- `jhonatancreeai/calcom:YYYYMMDD-HHMM`

### **Para Usar no Portainer:**
```yaml
services:
  calcom-api:
    image: jhonatancreeai/calcom:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:senha@postgres:5432/calcom_pdv
```

### **Para Testar Localmente:**
```bash
docker pull jhonatancreeai/calcom:latest
docker run -d -p 3000:3000 jhonatancreeai/calcom:latest
```

## 🔗 **Links Úteis:**
- **Docker Hub**: https://hub.docker.com/r/jhonatancreeai/calcom
- **API Health**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/

## 🎯 **Próximos Passos:**
1. Execute o script
2. Use a imagem no Portainer
3. Configure as variáveis de ambiente
4. Deploy da stack completa

**Bora fazer o deploy! 🚀**
