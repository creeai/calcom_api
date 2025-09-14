# 🚀 Configuração do GitHub

## Passos para Publicar no GitHub

### 1. Inicializar o Repositório Git
```bash
# Se ainda não foi inicializado
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "feat: implementação inicial da API Cal.com com suporte ao Easy Panel"
```

### 2. Criar Repositório no GitHub
1. Acesse [GitHub.com](https://github.com)
2. Clique em "New repository"
3. Nome: `calcom-api` (ou o nome que preferir)
4. Descrição: "API REST para sistema de agendamentos Cal.com com PostgreSQL"
5. Marque como **Público** ou **Privado** conforme necessário
6. **NÃO** marque "Add a README file" (já temos um)
7. Clique em "Create repository"

### 3. Conectar o Repositório Local
```bash
# Adicionar o remote origin
git remote add origin https://github.com/SEU-USUARIO/calcom-api.git

# Renomear branch principal para main (se necessário)
git branch -M main

# Fazer push inicial
git push -u origin main
```

### 4. Configurar Branch Protection (Opcional)
1. Vá em Settings > Branches
2. Adicione uma regra para a branch `main`
3. Marque "Require pull request reviews before merging"

## 📁 Estrutura Final do Projeto

```
calcom-API/
├── 📄 README.md                 # Documentação principal
├── 📄 LICENSE                   # Licença MIT
├── 📄 package.json              # Configurações do Node.js
├── 📄 .env.example              # Exemplo de variáveis de ambiente
├── 📄 .gitignore                # Arquivos ignorados pelo Git
├── 🐳 Dockerfile                # Container Docker
├── 🐳 docker-compose.yml        # Desenvolvimento local
├── 🐳 docker-compose.prod.yml   # Produção
├── 📄 easy-panel-config.md      # Configuração para Easy Panel
├── 📄 GITHUB_SETUP.md           # Este arquivo
├── 📄 index.js                  # Servidor principal
├── 📄 db.js                     # Configuração do banco
└── 📁 routes/                   # Rotas da API
    ├── 📄 users.js
    ├── 📄 bookings.js
    └── 📄 eventTypes.js
```

## 🔗 Links Úteis

- **Repositório**: `https://github.com/SEU-USUARIO/calcom-api`
- **Issues**: `https://github.com/SEU-USUARIO/calcom-api/issues`
- **Releases**: `https://github.com/SEU-USUARIO/calcom-api/releases`

## 📝 Próximos Passos

1. ✅ **Código commitado no GitHub**
2. ✅ **Documentação completa**
3. ✅ **Configuração para Easy Panel**
4. 🔄 **Deploy no Easy Panel**
5. 🔄 **Testes em produção**
6. 🔄 **Configuração de domínio**

## 🎯 Comandos Úteis

```bash
# Ver status do git
git status

# Adicionar mudanças
git add .

# Commit com mensagem
git commit -m "feat: nova funcionalidade"

# Push para GitHub
git push origin main

# Pull do GitHub
git pull origin main

# Ver histórico
git log --oneline
```

## 🏷️ Tags e Releases

Para criar uma release:

```bash
# Criar tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push da tag
git push origin v1.0.0
```

Depois vá em GitHub > Releases > Create a new release e selecione a tag criada.

## 🔧 Configurações Recomendadas

### GitHub Actions (Opcional)
Crie `.github/workflows/ci.yml` para CI/CD:

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

### Templates
Crie templates para Issues e Pull Requests em `.github/`:
- `ISSUE_TEMPLATE.md`
- `PULL_REQUEST_TEMPLATE.md`

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código commitado e enviado
- [ ] README.md atualizado
- [ ] Licença adicionada
- [ ] .gitignore configurado
- [ ] Dockerfile funcionando
- [ ] Documentação completa
- [ ] Configuração para Easy Panel pronta
