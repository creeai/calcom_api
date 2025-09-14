docker push jhonatancreeai/calcom:tagname
#!/bin/bash

# Script para build e push da imagem Cal.com API para Docker Hub
# Uso: ./build-and-push.sh [versao] [usuario-dockerhub]

# Configurações
DOCKER_USERNAME=${2:-"seuusuario"}  # Substitua pelo seu usuário do Docker Hub
IMAGE_NAME="calcom-api"
VERSION=${1:-"latest"}
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "🐳 Building and pushing Cal.com API to Docker Hub"
echo "📦 Image: ${FULL_IMAGE_NAME}"
echo ""

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Fazer login no Docker Hub
echo "🔐 Fazendo login no Docker Hub..."
echo "Por favor, insira suas credenciais do Docker Hub:"
docker login

if [ $? -ne 0 ]; then
    echo "❌ Falha no login do Docker Hub"
    exit 1
fi

# Build da imagem
echo "🔨 Building image ${FULL_IMAGE_NAME}..."
docker build -f Dockerfile.production -t ${FULL_IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo "❌ Falha no build da imagem"
    exit 1
fi

# Tag adicional para latest se não for a versão latest
if [ "${VERSION}" != "latest" ]; then
    echo "🏷️  Criando tag latest..."
    docker tag ${FULL_IMAGE_NAME} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

# Push da imagem
echo "📤 Pushing image to Docker Hub..."
docker push ${FULL_IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Falha no push da imagem"
    exit 1
fi

# Push da tag latest se aplicável
if [ "${VERSION}" != "latest" ]; then
    echo "📤 Pushing latest tag..."
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

echo ""
echo "✅ Sucesso! Imagem enviada para Docker Hub:"
echo "   🐳 ${FULL_IMAGE_NAME}"
if [ "${VERSION}" != "latest" ]; then
    echo "   🐳 ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
fi
echo ""
echo "🌐 Para usar a imagem:"
echo "   docker pull ${FULL_IMAGE_NAME}"
echo ""
echo "📋 Para usar no docker-compose:"
echo "   image: ${FULL_IMAGE_NAME}"
