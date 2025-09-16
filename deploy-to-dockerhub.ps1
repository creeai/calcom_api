# Script para Build e Push da Cal.com API para Docker Hub
# Execute este script quando o Docker Desktop estiver rodando

Write-Host "🐳 Cal.com API - Build e Push para Docker Hub" -ForegroundColor Cyan
Write-Host "📦 Repositório: your-username/calcom" -ForegroundColor Yellow
Write-Host ""

# Verificar se o Docker está rodando
Write-Host "🔍 Verificando se o Docker está rodando..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não está rodando"
    }
    Write-Host "✅ Docker está rodando!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker Desktop e execute este script novamente." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Login no Docker Hub
Write-Host "🔐 Fazendo login no Docker Hub..." -ForegroundColor Yellow
docker login -u your-username

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login do Docker Hub" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Build da imagem
Write-Host "🔨 Building image your-username/calcom:latest..." -ForegroundColor Yellow
docker build -f Dockerfile.production -t your-username/calcom:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build da imagem" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Tag para versão específica
$version = Get-Date -Format "yyyyMMdd-HHmm"
Write-Host "🏷️  Criando tag de versão: your-username/calcom:$version" -ForegroundColor Yellow
docker tag your-username/calcom:latest your-username/calcom:$version

# Push da imagem latest
Write-Host "📤 Pushing image latest..." -ForegroundColor Yellow
docker push your-username/calcom:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no push da imagem latest" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Push da versão específica
Write-Host "📤 Pushing image $version..." -ForegroundColor Yellow
docker push your-username/calcom:$version

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no push da versão $version" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "✅ Sucesso! Imagens enviadas para Docker Hub:" -ForegroundColor Green
Write-Host "   🐳 your-username/calcom:latest" -ForegroundColor Cyan
Write-Host "   🐳 your-username/calcom:$version" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Para usar a imagem:" -ForegroundColor Yellow
Write-Host "   docker pull your-username/calcom:latest"
Write-Host ""
Write-Host "📋 Para usar no docker-compose:" -ForegroundColor Yellow
Write-Host "   image: your-username/calcom:latest"
Write-Host ""
Write-Host "🔗 Acesse: https://hub.docker.com/r/your-username/calcom" -ForegroundColor Magenta

Read-Host "Pressione Enter para sair"
