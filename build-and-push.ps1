# Script PowerShell para build e push da imagem Cal.com API para Docker Hub
# Uso: .\build-and-push.ps1 [versao] [usuario-dockerhub]

param(
    [string]$Version = "latest",
    [string]$DockerUsername = "seuusuario"  # Substitua pelo seu usuário do Docker Hub
)

# Configurações
$ImageName = "calcom-api"
$FullImageName = "${DockerUsername}/${ImageName}:${Version}"

Write-Host "🐳 Building and pushing Cal.com API to Docker Hub" -ForegroundColor Cyan
Write-Host "📦 Image: $FullImageName" -ForegroundColor Yellow
Write-Host ""

# Verificar se o Docker está rodando
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não está rodando"
    }
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Fazer login no Docker Hub
Write-Host "🔐 Fazendo login no Docker Hub..." -ForegroundColor Yellow
Write-Host "Por favor, insira suas credenciais do Docker Hub:"
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login do Docker Hub" -ForegroundColor Red
    exit 1
}

# Build da imagem
Write-Host "🔨 Building image $FullImageName..." -ForegroundColor Yellow
docker build -f Dockerfile.production -t $FullImageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build da imagem" -ForegroundColor Red
    exit 1
}

# Tag adicional para latest se não for a versão latest
if ($Version -ne "latest") {
    Write-Host "🏷️  Criando tag latest..." -ForegroundColor Yellow
    docker tag $FullImageName "${DockerUsername}/${ImageName}:latest"
}

# Push da imagem
Write-Host "📤 Pushing image to Docker Hub..." -ForegroundColor Yellow
docker push $FullImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no push da imagem" -ForegroundColor Red
    exit 1
}

# Push da tag latest se aplicável
if ($Version -ne "latest") {
    Write-Host "📤 Pushing latest tag..." -ForegroundColor Yellow
    docker push "${DockerUsername}/${ImageName}:latest"
}

Write-Host ""
Write-Host "✅ Sucesso! Imagem enviada para Docker Hub:" -ForegroundColor Green
Write-Host "   🐳 $FullImageName" -ForegroundColor Cyan
if ($Version -ne "latest") {
    Write-Host "   🐳 ${DockerUsername}/${ImageName}:latest" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "🌐 Para usar a imagem:" -ForegroundColor Yellow
Write-Host "   docker pull $FullImageName"
Write-Host ""
Write-Host "📋 Para usar no docker-compose:" -ForegroundColor Yellow
Write-Host "   image: $FullImageName"
