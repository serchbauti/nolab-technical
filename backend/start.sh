#!/bin/bash

# Script de inicio para producción
echo "🚀 Iniciando Sistema de Reservas Nolab..."

# Configurar Node.js para usar menos memoria
export NODE_OPTIONS="--max-old-space-size=256"

# Verificar que la base de datos existe
if [ ! -f "data/app.db" ]; then
    echo "📊 Creando base de datos SQLite..."
    mkdir -p data
    touch data/app.db
    echo "✅ Base de datos creada"
fi

# Verificar que el build existe
if [ ! -d "dist" ]; then
    echo "🔨 Compilando proyecto..."
    npm run build
fi

# Iniciar la aplicación
echo "🌐 Iniciando servidor en puerto $PORT..."
node dist/server-prod.js
