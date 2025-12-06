import { useState, useRef, useEffect, useCallback } from 'react';
import { Type, Square, Circle, Download, Undo, Trash2, Save, Palette, Upload, Move } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CanvasElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  color: string;
  imageData?: string;
  selected?: boolean;
}

export function FabricDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'rect' | 'circle'>('select');
  const [color, setColor] = useState('#ffffff');
  const [productType, setProductType] = useState<'tshirt' | 'case' | 'mug'>('tshirt');
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const colors = ['#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
  
  const productTypes = [
    { id: 'tshirt', label: 'Camiseta', icon: '👕' },
    { id: 'case', label: 'Funda', icon: '📱' },
    { id: 'mug', label: 'Taza', icon: '☕' },
  ];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and set background
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw product template
    ctx.fillStyle = '#9ca3af';
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    
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
      ctx.fill();
      ctx.stroke();
    } else if (productType === 'case') {
      ctx.beginPath();
      ctx.roundRect(80, 30, 140, 280, 20);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(70, 80, 160, 200);
      ctx.beginPath();
      ctx.ellipse(150, 80, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(150, 280, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(250, 180, 40, -Math.PI / 2, Math.PI / 2);
      ctx.lineWidth = 15;
      ctx.stroke();
      ctx.lineWidth = 2;
    }
    
    // Draw elements
    elements.forEach((el) => {
      ctx.fillStyle = el.color;
      
      if (el.type === 'rect') {
        ctx.fillRect(el.x, el.y, el.width || 60, el.height || 40);
        if (el.id === selectedId) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x - 2, el.y - 2, (el.width || 60) + 4, (el.height || 40) + 4);
        }
      } else if (el.type === 'circle') {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius || 30, 0, Math.PI * 2);
        ctx.fill();
        if (el.id === selectedId) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (el.type === 'text') {
        ctx.font = `${el.fontSize || 24}px Arial`;
        ctx.fillText(el.text || 'Texto', el.x, el.y);
        if (el.id === selectedId) {
          const metrics = ctx.measureText(el.text || 'Texto');
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1;
          ctx.strokeRect(el.x - 2, el.y - (el.fontSize || 24), metrics.width + 4, (el.fontSize || 24) + 6);
        }
      } else if (el.type === 'image' && el.imageData) {
        const img = new Image();
        img.src = el.imageData;
        ctx.drawImage(img, el.x, el.y, el.width || 80, el.height || 80);
        if (el.id === selectedId) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x - 2, el.y - 2, (el.width || 80) + 4, (el.height || 80) + 4);
        }
      }
    });
  }, [elements, productType, selectedId]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getElementAtPosition = (x: number, y: number): CanvasElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.type === 'rect' || el.type === 'image') {
        if (x >= el.x && x <= el.x + (el.width || 60) && 
            y >= el.y && y <= el.y + (el.height || 40)) {
          return el;
        }
      } else if (el.type === 'circle') {
        const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2);
        if (dist <= (el.radius || 30)) return el;
      } else if (el.type === 'text') {
        if (x >= el.x && x <= el.x + 100 && 
            y >= el.y - (el.fontSize || 24) && y <= el.y) {
          return el;
        }
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'select') {
      const el = getElementAtPosition(x, y);
      if (el) {
        setSelectedId(el.id);
        setIsDragging(true);
        setDragOffset({ x: x - el.x, y: y - el.y });
      } else {
        setSelectedId(null);
      }
    } else if (tool === 'rect') {
      addElement('rect', x, y);
      setTool('select');
    } else if (tool === 'circle') {
      addElement('circle', x, y);
      setTool('select');
    } else if (tool === 'text') {
      const text = prompt('Ingresa el texto:');
      if (text) {
        addElement('text', x, y, { text });
      }
      setTool('select');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    setElements(prev => prev.map(el => 
      el.id === selectedId ? { ...el, x, y } : el
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addElement = (type: CanvasElement['type'], x: number, y: number, extra?: Partial<CanvasElement>) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type,
      x,
      y,
      color,
      width: type === 'rect' || type === 'image' ? 60 : undefined,
      height: type === 'rect' || type === 'image' ? 40 : undefined,
      radius: type === 'circle' ? 30 : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      ...extra,
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      addElement('image', 100, 150, { 
        imageData: event.target?.result as string,
        width: 80,
        height: 80,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const deleteSelected = () => {
    if (selectedId) {
      setElements(prev => prev.filter(el => el.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedId(null);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const preview = canvas.toDataURL('image/png');
    
    await supabase.from('designs').insert({
      name: `Diseno ${productType} - ${new Date().toLocaleDateString()}`,
      canvas_data: { elements, productType },
      preview_url: preview,
      product_type: productType,
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `design-${productType}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section id="designer" className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Designer POD</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Crea Tu Diseno Unico</h2>
          <p className="text-gray-400 mt-4">Herramienta interactiva para personalizar productos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tools Panel */}
          <div className="bg-gray-900 rounded-xl p-6 space-y-6">
            {/* Product Type */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Producto</label>
              <div className="grid grid-cols-3 gap-2">
                {productTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setProductType(pt.id as typeof productType)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      productType === pt.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{pt.icon}</span>
                    <span className="text-xs">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Herramientas</label>
              <div className="grid grid-cols-5 gap-2">
                <button onClick={() => setTool('select')} className={`p-3 rounded-lg flex flex-col items-center gap-1 ${tool === 'select' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  <Move className="w-5 h-5" />
                  <span className="text-xs">Mover</span>
                </button>
                <button onClick={() => setTool('text')} className={`p-3 rounded-lg flex flex-col items-center gap-1 ${tool === 'text' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  <Type className="w-5 h-5" />
                  <span className="text-xs">Texto</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-lg flex flex-col items-center gap-1 bg-gray-800 text-gray-400 hover:text-white">
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Imagen</span>
                </button>
                <button onClick={() => setTool('rect')} className={`p-3 rounded-lg flex flex-col items-center gap-1 ${tool === 'rect' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  <Square className="w-5 h-5" />
                  <span className="text-xs">Rect</span>
                </button>
                <button onClick={() => setTool('circle')} className={`p-3 rounded-lg flex flex-col items-center gap-1 ${tool === 'circle' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  <Circle className="w-5 h-5" />
                  <span className="text-xs">Circulo</span>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                <Palette className="w-4 h-4 inline mr-2" />
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-purple-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={deleteSelected} disabled={!selectedId} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 py-2 rounded-lg">
                <Trash2 className="w-4 h-4" />
                Eliminar Seleccion
              </button>
              <button onClick={clearCanvas} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg">
                <Undo className="w-4 h-4" />
                Limpiar Todo
              </button>
            </div>

            <div className="text-gray-500 text-xs">
              <p>Haz clic en el canvas para agregar elementos.</p>
              <p>Arrastra para mover los elementos seleccionados.</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6">
            <div className="bg-gray-700 rounded-xl p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={350}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-crosshair rounded-lg border border-gray-600"
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  saved ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Save className="w-5 h-5" />
                {saved ? 'Guardado!' : 'Guardar Diseno'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Descargar PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
