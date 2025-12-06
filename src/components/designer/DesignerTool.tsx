import { useState, useRef, useEffect } from 'react';
import { Type, Image, Square, Circle, Download, Undo, Trash2, Save, Palette } from 'lucide-react';

export function DesignerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'rect' | 'circle'>('select');
  const [color, setColor] = useState('#00f2ff');
  const [productType, setProductType] = useState<'tshirt' | 'case' | 'mug'>('tshirt');
  const [elements, setElements] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  
  const colors = ['#ffffff', '#000000', '#ff00cc', '#ff3399', '#00f2ff', '#00ccff', '#8b5cf6', '#22c55e', '#eab308'];
  
  const productTypes = [
    { id: 'tshirt', label: 'Camiseta', icon: Shirt },
    { id: 'case', label: 'Funda', icon: Phone },
    { id: 'mug', label: 'Taza', icon: Coffee },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Draw product template with glow
    if (productType === 'tshirt') {
      ctx.beginPath();
      ctx.moveTo(100, 50);
      ctx.lineTo(50, 100);
      ctx.lineTo(50, 150);
      ctx.lineTo(80, 150);
      ctx.lineTo(80, 300);
      ctx.lineTo(220, 300);
      ctx.lineTo(220, 150);
      ctx.lineTo(250, 150);
      ctx.lineTo(250, 100);
      ctx.lineTo(200, 50);
      ctx.closePath();
      ctx.fillStyle = 'rgba(15, 15, 40, 0.9)';
      ctx.fill();
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f2ff';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (productType === 'case') {
      ctx.beginPath();
      ctx.roundRect(80, 30, 140, 280, 20);
      ctx.fillStyle = 'rgba(15, 15, 40, 0.9)';
      ctx.fill();
      ctx.strokeStyle = '#ff00cc';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff00cc';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.beginPath();
      ctx.ellipse(150, 280, 80, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 15, 40, 0.9)';
      ctx.fill();
      ctx.fillRect(70, 80, 160, 200);
      ctx.beginPath();
      ctx.ellipse(150, 80, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(250, 180, 40, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 15;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Draw elements
    elements.forEach((el) => {
      ctx.fillStyle = el.color || '#00f2ff';
      ctx.shadowColor = el.color || '#00f2ff';
      ctx.shadowBlur = 5;
      if (el.type === 'rect') {
        ctx.fillRect(el.x, el.y, el.width, el.height);
      } else if (el.type === 'circle') {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'text') {
        ctx.font = `bold ${el.size || 24}px Montserrat, sans-serif`;
        ctx.fillText(el.text, el.x, el.y);
      }
      ctx.shadowBlur = 0;
    });
  }, [productType, elements]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'rect') {
      setElements([...elements, { type: 'rect', x, y, width: 60, height: 40, color }]);
    } else if (tool === 'circle') {
      setElements([...elements, { type: 'circle', x, y, radius: 30, color }]);
    } else if (tool === 'text') {
      const text = prompt('Ingresa el texto:');
      if (text) {
        setElements([...elements, { type: 'text', x, y, text, size: 24, color }]);
      }
    }
    setTool('select');
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `design-${productType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <section id="designer" className="py-20 cyber-bg relative">
      <div className="absolute inset-0 stars-bg opacity-30" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-magenta-light text-sm font-bold uppercase tracking-widest">Designer</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Crea Tu Diseno Unico</h2>
          <p className="text-gray-400 mt-4">Personaliza productos con tu creatividad</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tools Panel */}
          <div className="card-cyber neon-border-cyan space-y-6">
            {/* Product Type */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">Producto</label>
              <div className="grid grid-cols-3 gap-2">
                {productTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setProductType(pt.id as typeof productType)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      productType === pt.id
                        ? 'bg-gradient-to-r from-magenta to-cyan text-white shadow-glow-magenta'
                        : 'bg-midnight text-gray-400 hover:text-white border border-cyan/20 hover:border-cyan/50'
                    }`}
                  >
                    <pt.icon className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs font-bold">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">Herramientas</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'text', icon: Type, label: 'Texto' },
                  { id: 'image', icon: Image, label: 'Imagen' },
                  { id: 'rect', icon: Square, label: 'Rect' },
                  { id: 'circle', icon: Circle, label: 'Circulo' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id as typeof tool)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      tool === t.id
                        ? 'bg-gradient-to-r from-violet to-magenta text-white shadow-glow-violet'
                        : 'bg-midnight text-gray-400 hover:text-white border border-violet/20 hover:border-violet/50'
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">
                <Palette className="w-4 h-4 inline mr-2" />
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-midnight scale-110' : ''
                    }`}
                    style={{ backgroundColor: c, boxShadow: color === c ? `0 0 15px ${c}` : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => setElements(elements.slice(0, -1))}
                className="w-full flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light text-gray-300 py-2.5 rounded-xl border border-cyan/20 hover:border-cyan/50 transition-all font-bold"
              >
                <Undo className="w-4 h-4" />
                Deshacer
              </button>
              <button
                onClick={() => setElements([])}
                className="w-full flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light text-gray-300 py-2.5 rounded-xl border border-magenta/20 hover:border-magenta/50 transition-all font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 card-cyber neon-border-magenta">
            <div className="bg-midnight rounded-xl p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={350}
                onClick={handleCanvasClick}
                className="cursor-crosshair rounded-lg shadow-glow-cyan"
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${
                  saved
                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'bg-gradient-to-r from-violet to-magenta hover:shadow-glow-magenta text-white'
                }`}
              >
                <Save className="w-5 h-5" />
                {saved ? 'Guardado!' : 'Guardar Diseno'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan to-cyan-light hover:shadow-glow-cyan text-midnight py-3 rounded-full font-bold transition-all"
              >
                <Download className="w-5 h-5" />
                Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Icon components
function Shirt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
}

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function Coffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
      <line x1="6" y1="2" x2="6" y2="4"/>
      <line x1="10" y1="2" x2="10" y2="4"/>
      <line x1="14" y1="2" x2="14" y2="4"/>
    </svg>
  );
}
