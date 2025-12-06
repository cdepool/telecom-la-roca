#!/bin/bash

# Telecom La Roca - Script para Desplegar en GitHub
# Ejecuta este script después de crear el repositorio en GitHub

echo "🚀 Telecom La Roca - Despliegue en GitHub"
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# Verificar que Git está configurado
if ! git config user.name > /dev/null 2>&1; then
    echo "🔧 Configurando Git..."
    git config user.email "info@telecomlaroca.com"
    git config user.name "Telecom La Roca"
fi

# Verificar si el remote ya existe
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote 'origin' ya configurado"
    read -p "¿Quieres actualizar la URL del remote? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin https://github.com/cdepool/telecom-la-roca.git
        echo "✅ URL del remote actualizada"
    fi
else
    echo "🔗 Configurando remote..."
    git remote add origin https://github.com/cdepool/telecom-la-roca.git
    echo "✅ Remote 'origin' agregado"
fi

# Verificar el estado actual
echo "📊 Estado actual del repositorio:"
git status

# Preguntar si quiere continuar
read -p "¿Quieres continuar con el despliegue? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "❌ Despliegue cancelado"
    exit 0
fi

# Cambiar a rama main
echo "🔄 Cambiando a rama 'main'..."
git branch -M main

# Agregar cambios
echo "📁 Agregando archivos..."
git add .

# Commit (solo si hay cambios)
if git diff --cached --quiet; then
    echo "ℹ️  No hay cambios nuevos para commitear"
else
    echo "💾 Creando commit..."
    git commit -m "feat: sitio web Telecom La Roca - versión completa

- Página principal con hero section y servicios
- Mapa interactivo con Google Maps (Acarigua, Venezuela)
- Sistema de citas integrado con Supabase
- Sección de contacto completa con WhatsApp
- Footer con información de la empresa
- Diseño responsivo con tema cyber/futurista
- Ubicación: Centro Comercial Latin Center, Local 10-11, Av. 33
- Contacto: (+58) 424-5896062
- Instagram: @larocacasetech
- Stack: React 18 + TypeScript + Vite + Tailwind + Supabase

Closes #1"
    echo "✅ Commit creado"
fi

# Push a GitHub
echo "☁️  Subiendo a GitHub..."
if git push -u origin main; then
    echo ""
    echo "🎉 ¡DESPLIEGUE EXITOSO!"
    echo "=========================================="
    echo "✅ Repositorio: https://github.com/cdepool/telecom-la-roca"
    echo "🌐 Demo: https://qbdcrl6s4791.space.minimax.io"
    echo "📱 WhatsApp: (+58) 424-5896062"
    echo "📸 Instagram: @larocacasetech"
    echo "📍 Ubicación: Acarigua, Venezuela"
    echo "=========================================="
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Verifica el repositorio en GitHub"
    echo "2. Agrega tópicos al repositorio:"
    echo "   telecom, technology, mobile-phones, acarigua, venezuela, repair, electronics, react, typescript, supabase"
    echo "3. Agrega el link del demo: https://qbdcrl6s4791.space.minimax.io"
    echo ""
    echo "🚀 ¡Tu sitio web ya está en GitHub!"
else
    echo "❌ Error al subir a GitHub"
    echo "💡 Posibles soluciones:"
    echo "1. Verifica que el repositorio exista en https://github.com/cdepool/telecom-la-roca"
    echo "2. Verifica que tengas permisos de escritura en la organización cdepool"
    echo "3. Verifica tu conexión a internet"
    exit 1
fi