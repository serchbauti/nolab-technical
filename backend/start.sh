#!/bin/bash

# Production startup script
echo "🚀 Starting Nolab Reservations System..."

# Configure Node.js to use less memory
export NODE_OPTIONS="--max-old-space-size=256"

# Verify that the database exists
if [ ! -f "data/app.db" ]; then
    echo "📊 Creating SQLite database..."
    mkdir -p data
    touch data/app.db
    echo "✅ Database created"
fi

# Verify that the build exists
if [ ! -d "dist" ]; then
    echo "🔨 Compiling project..."
    npm run build
fi

# Start the application
echo "🌐 Starting server on port $PORT..."
node dist/server-prod.js
