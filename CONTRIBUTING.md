# Contribución al Proyecto Telecom La Roca

¡Gracias por tu interés en contribuir al sitio web de Telecom La Roca! Este documento te ayudará a empezar.

## 🚀 Primeros Pasos

1. **Fork del repositorio**
2. **Clona tu fork:**
   ```bash
   git clone https://github.com/tu-usuario/telecom-la-roca.git
   cd telecom-la-roca
   ```

3. **Crea una rama para tu feature:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

4. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🛠️ Configuración del Entorno de Desarrollo

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Supabase
El proyecto utiliza Supabase como backend. Necesitarás:
1. Una cuenta en [Supabase](https://supabase.com)
2. Crear un proyecto
3. Configurar las tablas: `services` y `appointments`

### Google Maps
Requiere una API key de Google Maps con estos servicios habilitados:
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API

## 📝 Estándares de Código

### TypeScript
- Usa TypeScript strict mode
- Define tipos para todos los props y estado
- Evita `any` cuando sea posible

### Componentes React
- Usa componentes funcionales con hooks
- Nombres de componentes en PascalCase
- Props interface con prefijo `Props`
- Un componente por archivo

### Estilos
- Usa Tailwind CSS para estilos
- Utiliza las clases de utilidad existentes
- Mantén consistencia con el diseño cyber/futurista

### Git Commits
Sigue la convención de Conventional Commits:
```
feat: agregar nueva funcionalidad
fix: corregir un bug
docs: actualizar documentación
style: cambios de formato sin afectar funcionalidad
refactor: refactorización de código
test: agregar o modificar tests
chore: mantenimiento del proyecto
```

## 🧪 Testing

Antes de hacer commit:
```bash
npm run lint
npm run build
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── admin/          # Componentes de administración
│   ├── appointments/   # Formularios de citas
│   ├── home/          # Componentes de página principal
│   ├── maps/          # Componentes de mapas
│   └── shop/          # Componentes de tienda
├── lib/               # Utilidades y configuraciones
├── types/             # Definiciones de TypeScript
└── hooks/             # Custom hooks (si es necesario)
```

## 🎨 Guías de Diseño

### Colores
- **Primarios:** Cyan (#00f2ff), Magenta (#ff00cc)
- **Secundarios:** Violet (#8b5cf6)
- **Fondo:** Midnight (#0a0a1a), Dark (#1a1a2e)

### Tipografía
- **Fuente:** Inter o similar
- **Títulos:** Bold/Black weights
- **Body:** Regular weight

### Efectos
- **Neon borders:** Usar clases como `neon-border-cyan`
- **Glow effects:** `shadow-glow-cyan`, `shadow-glow-magenta`
- **Gradientes:** `bg-gradient-to-r from-cyan to-magenta`

## 🔧 Funcionalidades Existentes

### Mapa Interactivo
- Ubicación: Acarigua, Venezuela (9.5545, -69.1956)
- Búsqueda de direcciones
- Cálculo de rutas
- Lugares cercanos

### Sistema de Citas
- Formulario de agendamiento
- Integración con Supabase
- Webhook para GHL

### Contacto
- WhatsApp: (+58) 424-5896062
- Instagram: @larocacasetech
- Horarios: Lun-Sab 8am-6pm, Dom 9am-4pm

## 🐛 Reportar Bugs

Cuando reportes un bug, incluye:
1. **Descripción del problema**
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Screenshots (si aplica)**
5. **Información del entorno** (navegador, OS)

## 💡 Solicitar Features

Para nuevas funcionalidades:
1. Verifica que no esté ya implementada
2. Describe el caso de uso
3. Propón la implementación
4. Considera el impacto en UX

## 📞 Contacto

Para preguntas sobre contribuciones:
- **Email:** info@telecomlaroca.com
- **WhatsApp:** (+58) 424-5896062
- **Instagram:** [@larocacasetech](https://www.instagram.com/larocacasetech/)

## 📄 Licencia

Al contribuir, aceptas que tus cambios serán licenciados bajo la misma licencia que el proyecto original.

---

¡Gracias por hacer este proyecto mejor! 🚀