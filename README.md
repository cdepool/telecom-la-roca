# Telecom La Roca - Sitio Web

Sitio web oficial de Telecom La Roca, tienda de tecnología ubicada en Acarigua, Venezuela.

## 🌐 Demo en Vivo

**URL del sitio:** https://qbdcrl6s4791.space.minimax.io

## 📍 Información de la Tienda

**Telecom La Roca**  
Centro Comercial Latin Center, Local 10-11, Av. 33  
Acarigua, Estado Portuguesa, Venezuela

**Contacto:**
- 📱 WhatsApp: (+58) 424-5896062
- 📧 Email: info@telecomlaroca.com, soporte@telecomlaroca.com
- 📸 Instagram: [@larocacasetech](https://www.instagram.com/larocacasetech/)

**Horarios:**
- Lunes - Sábado: 8am - 6pm
- Domingo: 9am - 4pm

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API
- **Backend:** Supabase (Database, Auth, Edge Functions)
- **Deployment:** MiniMax.io

## 🗂️ Estructura del Proyecto

```
telecom-la-roca/
├── public/
│   ├── logo-black.png
│   └── logo-magenta.png
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx
│   │   ├── appointments/
│   │   │   └── AppointmentForm.tsx
│   │   ├── home/
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Services.tsx
│   │   ├── maps/
│   │   │   └── StoreMap.tsx
│   │   └── shop/
│   │       └── Cart.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Funcionalidades

### 🏠 Página Principal
- Hero section con información de la empresa
- Sección de servicios ofrecidos
- Sección de contacto con mapa interactivo

### 🗺️ Mapa Interactivo (Google Maps)
- Ubicación exacta en Acarigua, Venezuela (9.5545, -69.1956)
- Búsqueda de direcciones
- Cálculo de rutas
- Lugares cercanos (gasolineras, farmacias, tiendas, cafés)

### 📅 Sistema de Citas
- Formulario de agendamiento de servicios
- Integración con Supabase para almacenamiento
- Notificaciones via webhook (GHL)

### 📱 Contacto
- WhatsApp integrado: (+58) 424-5896062
- Redes sociales (Instagram)
- Horarios de atención
- Información completa de ubicación

## 🛠️ Instalación y Desarrollo

1. **Clonar el repositorio:**
```bash
git clone https://github.com/cdepool/telecom-la-roca.git
cd telecom-la-roca
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crear archivo `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Construir para producción:**
```bash
npm run build
```

## 🔧 Configuración

### Supabase
El proyecto utiliza Supabase para:
- Almacenamiento de citas
- Gestión de servicios
- Autenticación (futuro)

### Google Maps
Se requiere API key de Google Maps con los siguientes servicios habilitados:
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API

## 📊 Base de Datos

### Tabla: `services`
- id (UUID, primary key)
- name (text)
- description (text)
- base_price (decimal)
- is_active (boolean)
- created_at (timestamp)

### Tabla: `appointments`
- id (UUID, primary key)
- service_id (UUID, foreign key)
- scheduled_date (timestamp)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- device_info (text)
- notes (text)
- status (text)
- created_at (timestamp)

## 🌟 Características Destacadas

- **Diseño Responsivo:** Optimizado para móviles y escritorio
- **Mapa Interactivo:** Integración completa con Google Maps
- **Formularios Dinámicos:** Sistema de citas en tiempo real
- **SEO Optimizado:** Meta tags y estructura semántica
- **Accesibilidad:** Cumple estándares de accesibilidad web
- **Performance:** Carga rápida y optimizada

## 📱 Redes Sociales

- **Instagram:** [@larocacasetech](https://www.instagram.com/larocacasetech/)

## 📄 Licencia

© 2025 Telecom La Roca. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Telecom La Roca**  
*Especialistas en tecnología y dispositivos móviles en Acarigua, Venezuela*