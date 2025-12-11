-- Actualización de productos para Telecom La Roca
-- Ejecutar este script en el SQL Editor de Supabase

-- Primero, desactivar todos los productos actuales
UPDATE products SET is_active = false;

-- Eliminar productos antiguos si es necesario
-- DELETE FROM products WHERE is_active = false;

-- Insertar nuevos productos

-- REPARACIONES
INSERT INTO products (name, description, price, discount_price, category, is_pod, is_active, stock, images)
VALUES 
  ('Puerto de Carga', 'Reparación profesional de puerto de carga. Incluye cable gratis.', 10, NULL, 'reparaciones', false, true, 100, '[]'::jsonb),
  ('Batería iPhone', 'Reemplazo de batería original iPhone. Rendimiento garantizado.', 30, NULL, 'reparaciones', false, true, 50, '[]'::jsonb),
  ('Batería Samsung', 'Reemplazo de batería original Samsung. Calidad premium.', 30, NULL, 'reparaciones', false, true, 50, '[]'::jsonb),
  ('Recuperación de Datos', 'Servicio profesional de recuperación y migración de datos.', 30, NULL, 'reparaciones', false, true, 100, '[]'::jsonb),
  ('Pantalla Samsung', 'Reemplazo de pantalla original Samsung. Garantía incluida.', 30, NULL, 'reparaciones', false, true, 30, '[]'::jsonb),
  ('Pantalla iPhone', 'Reemplazo de pantalla original iPhone. Calidad certificada.', 30, NULL, 'reparaciones', false, true, 30, '[]'::jsonb),
  ('Reparación de Laptop', 'Diagnóstico y reparación profesional de laptops.', 30, NULL, 'reparaciones', false, true, 100, '[]'::jsonb);

-- PRODUCTOS PERSONALIZABLES (POD)
INSERT INTO products (name, description, price, discount_price, category, is_pod, is_active, stock, images)
VALUES 
  ('Funda Personalizada iPhone', 'Funda totalmente personalizable con tu diseño único.', 8, NULL, 'fundas', true, true, 999, '[]'::jsonb),
  ('Funda Personalizada Samsung', 'Funda totalmente personalizable con tu diseño único.', 8, NULL, 'fundas', true, true, 999, '[]'::jsonb),
  ('Camiseta Personalizada', 'Camiseta de alta calidad con tu diseño personalizado.', 12, NULL, 'ropa', true, true, 999, '[]'::jsonb),
  ('Taza Personalizada', 'Taza cerámica premium con tu diseño impreso.', 8, NULL, 'accesorios', true, true, 999, '[]'::jsonb);

-- ACCESORIOS
INSERT INTO products (name, description, price, discount_price, category, is_pod, is_active, stock, images)
VALUES 
  ('Cargador Rápido', 'Cargador rápido de alta eficiencia. Compatible con múltiples dispositivos.', 10, NULL, 'accesorios', false, true, 100, '[]'::jsonb),
  ('Cable Lightning Original', 'Cable Lightning certificado Apple. Calidad garantizada.', 8, NULL, 'accesorios', false, true, 100, '[]'::jsonb),
  ('Protector de Pantalla', 'Protector de pantalla de vidrio templado. Instalación incluida.', 3, NULL, 'accesorios', false, true, 200, '[]'::jsonb),
  ('Power Bank', 'Batería portátil de alta capacidad. Carga rápida.', 20, NULL, 'accesorios', false, true, 50, '[]'::jsonb);

-- Verificar los nuevos productos
SELECT id, name, price, category, is_pod, is_active, stock
FROM products
WHERE is_active = true
ORDER BY category, name;
