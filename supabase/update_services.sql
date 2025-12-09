-- Actualización de servicios para CYBER WEEK DIC25
-- Ejecutar este script en el SQL Editor de Supabase

-- Actualizar servicio "Pin de Carga"
UPDATE services
SET 
  base_price = 10,
  duration_minutes = 20,
  description = 'Reparación de pin de carga. Incluye cable gratis. Como darle nueva vida a tu conexión.'
WHERE name ILIKE '%pin%carga%' OR name ILIKE '%puerto%carga%';

-- Actualizar servicio "Batería iPhone"
UPDATE services
SET 
  base_price = 50,
  description = 'Reemplazo de batería iPhone. 100% de condición. Como recuperar la energía del primer día.'
WHERE name ILIKE '%batería%iphone%' OR name ILIKE '%bateria%iphone%';

-- Verificar los cambios
SELECT id, name, base_price, duration_minutes, description
FROM services
WHERE name ILIKE '%pin%carga%' 
   OR name ILIKE '%puerto%carga%'
   OR name ILIKE '%batería%iphone%' 
   OR name ILIKE '%bateria%iphone%';
