# Prueba Técnica Nolab

**Autor:** Sergio Perez Bautista

## 📋 Descripción

Sistema de reservas de salas de reunión con gestión inteligente de conflictos, prioridades y zonas horarias. El sistema permite crear, gestionar y resolver automáticamente colisiones entre reservas mediante lógica de prioridad y reasignación automática.

## 🏗️ Arquitectura del Sistema

### **Principios de Diseño**
- **Separación de responsabilidades** entre frontend y backend
- **Cálculos internos siempre en UTC** para consistencia
- **Visualización en zona horaria del usuario** para mejor UX
- **Gestión automática de conflictos** con reasignación inteligente

### **Flujo de Datos**
1. **Frontend**: Usuario selecciona hora local en su zona horaria
2. **Frontend**: Convierte a UTC antes de enviar a la API
3. **Backend**: Procesa todo en UTC (validaciones, colisiones, etc.)
4. **Backend**: Responde en UTC
5. **Frontend**: Convierte UTC a zona horaria del usuario para visualización

## 🚀 Tecnologías Utilizadas

### **Backend**

#### **Core Technologies**
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Lenguaje de programación tipado
- **Express.js** - Framework web para APIs REST

#### **Base de Datos**
- **SQLite** - Base de datos relacional ligera
- **SQLite3** - Driver para Node.js

#### **Librerías Principales**
- **Luxon** - Manipulación avanzada de fechas y zonas horarias
- **Zod** - Validación de esquemas y tipos
- **UUID** - Generación de identificadores únicos

#### **Estructura del Proyecto**
```
backend/
├── src/
│   ├── app.ts              # Configuración de Express
│   ├── server.ts           # Servidor HTTP
│   ├── config.ts           # Configuraciones del sistema
│   ├── domain/             # Lógica de dominio
│   │   ├── time.ts         # Utilidades de tiempo y zonas horarias
│   │   └── errors.ts       # Clases de error personalizadas
│   ├── services/           # Lógica de negocio
│   │   ├── reservations.service.ts    # Gestión de reservas
│   │   └── availability.service.ts    # Verificación de disponibilidad
│   ├── routes/             # Endpoints de la API
│   │   └── reservations.ts # Rutas de reservas
│   ├── middlewares/        # Middlewares de Express
│   │   ├── error.ts        # Manejo de errores
│   │   └── notFound.ts     # Manejo de rutas no encontradas
│   ├── db/                 # Configuración de base de datos
│   │   ├── client.ts       # Cliente de SQLite
│   │   └── bootstrap.ts    # Inicialización de la BD
│   └── validators/         # Esquemas de validación
│       └── reservation.dto.ts # DTOs para reservas
├── data/                   # Archivos de base de datos SQLite
├── package.json            # Dependencias y scripts
└── tsconfig.json          # Configuración de TypeScript
```

### **Frontend**

#### **Core Technologies**
- **React 18** - Biblioteca para interfaces de usuario
- **TypeScript** - Lenguaje de programación tipado
- **Vite** - Herramienta de build y desarrollo

#### **Librerías Principales**
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas (compartido con backend)
- **Luxon** - Manipulación de fechas (compartido con backend)
- **TanStack Query** - Gestión de estado del servidor

#### **Estructura del Proyecto**
```
frontend/
├── src/
│   ├── main.tsx           # Punto de entrada de la aplicación
│   ├── App.tsx            # Componente principal
│   ├── lib/               # Utilidades compartidas
│   │   ├── api.ts         # Cliente HTTP y tipos de API
│   │   └── time.ts        # Utilidades de tiempo
│   ├── features/          # Características de la aplicación
│   │   └── reservations/  # Módulo de reservas
│   │       ├── components/ # Componentes de UI
│   │       │   ├── ReservationForm.tsx      # Formulario de creación
│   │       │   ├── ReservationList.tsx      # Lista de reservas
│   │       │   └── ConflictModal.tsx        # Modal de conflictos
│   │       ├── hooks/     # Hooks personalizados
│   │       │   └── useReservations.ts       # Lógica de reservas
│   │       └── types.ts   # Tipos específicos del módulo
│   ├── App.css            # Estilos globales
│   └── index.css          # Estilos base
├── public/                # Archivos estáticos
├── package.json           # Dependencias y scripts
├── vite.config.ts         # Configuración de Vite
└── tsconfig.json         # Configuración de TypeScript
```

## 🔧 Funcionalidades Principales

### **Gestión de Reservas**
- ✅ **Crear reservas** con fecha, hora, duración y recursos
- ✅ **Validación de horario** de trabajo (Lun-Vie, 09:00-17:00)
- ✅ **Validación de duración** (30-120 minutos)
- ✅ **Gestión de recursos** (proyector, capacidad)

### **Sistema de Prioridades**
- ✅ **Prioridad Normal**: Puede ser desplazada por reservas de alta prioridad
- ✅ **Prioridad Alta**: Desplaza automáticamente reservas normales
- ✅ **Reasignación automática** de reservas desplazadas

### **Gestión de Zonas Horarias**
- ✅ **Soporte para múltiples zonas**: America/New_York, Asia/Tokyo, America/Mexico_City
- ✅ **Conversión automática** de hora local a UTC
- ✅ **Visualización en zona horaria** del usuario

### **Resolución de Conflictos**
- ✅ **Detección automática** de colisiones temporales
- ✅ **Validación de recursos** compartidos
- ✅ **Sugerencias de horarios** alternativos
- ✅ **Reasignación automática** basada en prioridad

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- **Node.js** 18+ 
- **npm** 9+

### **Backend**
```bash
cd backend
npm install
npm run dev
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### **Reservas**
- `GET /reservations` - Listar todas las reservas
- `POST /reservations` - Crear nueva reserva
- `GET /next-available` - Obtener próximo horario disponible

### **Formato de Reserva**
```json
{
  "startTime": "2025-08-13T10:00:00Z",
  "endTime": "2025-08-13T11:00:00Z",
  "priority": "normal",
  "resources": {
    "projector": false,
    "capacity": 4
  },
  "timezone": "America/New_York"
}
```

## 🧪 Casos de Prueba

### **1. Colisión Temporal**
- **Existente**: 10:00-11:00 UTC, prioridad normal, proyector: true
- **Nueva**: 10:30-11:30 UTC, prioridad normal, proyector: true
- **Resultado**: Colisión detectada con sugerencia de horario alternativo

### **2. Desplazamiento por Prioridad**
- **Existente**: 10:00-11:00 UTC, prioridad normal, sin proyector
- **Nueva**: 10:00-11:00 UTC, prioridad high, sin proyector
- **Resultado**: Nueva reserva se crea, existente se reasigna automáticamente

### **3. Manejo de Zonas Horarias**
- **Usuario**: Selecciona 5:00 AM en America/New_York
- **Sistema**: Convierte a 10:00 AM UTC internamente
- **Visualización**: Muestra 5:00 AM en zona horaria del usuario

## 🔍 Características Técnicas

### **Validaciones del Sistema**
- ✅ **Horario de trabajo**: Lunes a Viernes, 09:00-17:00 UTC
- ✅ **Duración mínima**: 30 minutos
- ✅ **Duración máxima**: 120 minutos
- ✅ **Capacidad máxima**: 8 personas por sala
- ✅ **Recursos únicos**: Proyector por sala

### **Lógica de Negocio**
- ✅ **Conflictos temporales**: Detección automática de solapamientos
- ✅ **Conflictos de recursos**: Validación de proyector y capacidad
- ✅ **Prioridad inteligente**: Reservas high desplazan normales
- ✅ **Reasignación automática**: Búsqueda de horarios alternativos

### **Manejo de Errores**
- ✅ **Validación de entrada**: Esquemas Zod para validación
- ✅ **Errores HTTP**: Códigos de estado apropiados
- ✅ **Mensajes descriptivos**: Información clara para el usuario
- ✅ **Sugerencias automáticas**: Horarios alternativos en caso de conflicto

## 🎯 Casos de Uso

### **Usuario Final**
1. **Seleccionar fecha y hora** en su zona horaria local
2. **Especificar recursos** necesarios (proyector, capacidad)
3. **Recibir confirmación** o sugerencias alternativas
4. **Ver reservas** en su zona horaria local

### **Administrador del Sistema**
1. **Monitorear conflictos** y resoluciones automáticas
2. **Gestionar prioridades** de reservas
3. **Verificar disponibilidad** de recursos
4. **Auditar reasignaciones** automáticas

## 🚀 Despliegue en Producción

### **Backend - Render**

El backend está desplegado en [Render](https://render.com) con las siguientes características:

#### **Configuración del Servicio**
- **Runtime**: Node.js 22.16.0
- **Plan**: Free (con limitaciones de memoria)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `./start.sh`
- **Health Check**: `/health`

#### **Variables de Entorno**
```bash
NODE_ENV=production
PORT=10000
CORS_ORIGIN=*
LOG_LEVEL=info
```

#### **URL de Producción**
- **API**: [https://nolab-technical.onrender.com](https://nolab-technical.onrender.com)
- **Health Check**: [https://nolab-technical.onrender.com/health](https://nolab-technical.onrender.com/health)

#### **Características del Despliegue**
- ✅ **Base de datos SQLite** persistente
- ✅ **CORS configurado** para permitir peticiones desde Netlify
- ✅ **Build automático** en cada push a GitHub
- ✅ **Logs públicos** para monitoreo
- ✅ **Restart automático** en caso de fallo

### **Frontend - Netlify**

El frontend está desplegado en [Netlify](https://netlify.com) con las siguientes características:

#### **Configuración del Build**
- **Base Directory**: `/frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Deploy automático** en cada push a GitHub

#### **Variables de Entorno**
```bash
VITE_API_URL=https://nolab-technical.onrender.com
VITE_APP_TITLE=Sistema de Reservas Nolab
VITE_APP_VERSION=1.0.0
```

#### **URL de Producción**
- **Frontend**: [https://nolab-technical.netlify.app](https://nolab-technical.netlify.app)

#### **Características del Despliegue**
- ✅ **SPA (Single Page Application)** con routing configurado
- ✅ **Redirects automáticos** para todas las rutas
- ✅ **Headers de seguridad** configurados
- ✅ **Build optimizado** con Terser
- ✅ **Assets comprimidos** y minificados

### **Configuración de CORS**

El backend está configurado para permitir peticiones desde:
- `http://localhost:3000` (desarrollo local)
- `https://nolab-technical.onrender.com` (backend)

---

**Desarrollado con ❤️ por Sergio Perez Bautista**
