import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type, Square, Circle, Download, Undo, Redo, Trash2, Save, Palette,
  Upload, Move, Pencil, Eraser, Minus, ZoomIn, ZoomOut, ShoppingBag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { CanvasElement, Tool, ProductType, Point } from '../../types/designer';

export function FabricDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [productType, setProductType] = useState<ProductType>('tshirt');
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [lineStart, setLineStart] = useState<Point | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    '#ffffff', '#000000', '#ff00cc', '#ff3399', '#00f2ff',
    '#00ccff', '#8b5cf6', '#22c55e', '#eab308', '#ef4444'
  ];

  const productTypes = [
    { id: 'tshirt' as const, label: 'Camiseta', icon: '👕' },
    { id: 'case' as const, label: 'Funda', icon: '📱' },
    { id: 'mug' as const, label: 'Taza', icon: '☕' },
  ];

  // Save to history
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
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

    // Draw product template
    ctx.save();
    ctx.scale(zoom, zoom);

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
      ctx.fillStyle = 'rgba(15, 15, 40, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f2ff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (productType === 'case') {
      ctx.beginPath();
      ctx.roundRect(80, 30, 140, 280, 20);
      ctx.fillStyle = 'rgba(15, 15, 40, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#ff00cc';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff00cc';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = 'rgba(15, 15, 40, 0.8)';
      ctx.fillRect(70, 80, 160, 200);
      ctx.beginPath();
      ctx.ellipse(150, 80, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(150, 280, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(250, 180, 40, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 15;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw elements
    elements.forEach((el) => {
      if (!el.visible) return;

      ctx.globalAlpha = el.opacity;
      ctx.fillStyle = el.color;
      ctx.strokeStyle = el.color;

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
        ctx.font = `bold ${el.fontSize || 24}px Montserrat, sans-serif`;
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 5;
        ctx.fillText(el.text || 'Texto', el.x, el.y);
        ctx.shadowBlur = 0;
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
      } else if (el.type === 'path' && el.paths) {
        el.paths.forEach(path => {
          if (path.points.length < 2) return;
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = path.opacity;

          if (path.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
          }

          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
          }
          ctx.stroke();

          ctx.globalCompositeOperation = 'source-over';
        });
      }

      ctx.globalAlpha = 1;
    });

    // Draw current path being drawn
    if (currentPath.length > 0) {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }, [elements, productType, selectedId, zoom, currentPath, color, strokeWidth]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getElementAtPosition = (x: number, y: number): CanvasElement | null => {
    const adjustedX = x / zoom;
    const adjustedY = y / zoom;

    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (!el.visible) continue;

      if (el.type === 'rect' || el.type === 'image') {
        if (adjustedX >= el.x && adjustedX <= el.x + (el.width || 60) &&
          adjustedY >= el.y && adjustedY <= el.y + (el.height || 40)) {
          return el;
        }
      } else if (el.type === 'circle') {
        const dist = Math.sqrt((adjustedX - el.x) ** 2 + (adjustedY - el.y) ** 2);
        if (dist <= (el.radius || 30)) return el;
      } else if (el.type === 'text') {
        if (adjustedX >= el.x && adjustedX <= el.x + 100 &&
          adjustedY >= el.y - (el.fontSize || 24) && adjustedY <= el.y) {
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
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (tool === 'select') {
      const el = getElementAtPosition(e.clientX - rect.left, e.clientY - rect.top);
      if (el) {
        setSelectedId(el.id);
        setIsDragging(true);
        setDragOffset({ x: x - el.x, y: y - el.y });
      } else {
        setSelectedId(null);
      }
    } else if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (tool === 'line') {
      if (!lineStart) {
        setLineStart({ x, y });
      } else {
        addElement('path', lineStart.x, lineStart.y, {
          paths: [{
            id: `path-${Date.now()}`,
            points: [lineStart, { x, y }],
            color,
            width: strokeWidth,
            opacity: 1,
            tool: 'line'
          }]
        });
        setLineStart(null);
        setTool('select');
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (isDragging && selectedId && tool === 'select') {
      const newElements = elements.map(el =>
        el.id === selectedId ? { ...el, x: x - dragOffset.x, y: y - dragOffset.y } : el
      );
      setElements(newElements);
    } else if (isDrawing && (tool === 'pencil' || tool === 'eraser')) {
      setCurrentPath(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 0) {
      addElement('path', 0, 0, {
        paths: [{
          id: `path-${Date.now()}`,
          points: currentPath,
          color,
          width: strokeWidth,
          opacity: 1,
          tool: tool as 'pencil' | 'eraser'
        }]
      });
      setCurrentPath([]);
    }

    if (isDragging) {
      saveToHistory(elements);
    }

    setIsDragging(false);
    setIsDrawing(false);
  };

  const addElement = (type: CanvasElement['type'], x: number, y: number, extra?: Partial<CanvasElement>) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type,
      x,
      y,
      color,
      opacity: 1,
      visible: true,
      locked: false,
      layerId: 'default',
      width: type === 'rect' || type === 'image' ? 60 : undefined,
      height: type === 'rect' || type === 'image' ? 40 : undefined,
      radius: type === 'circle' ? 30 : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      ...extra,
    };
    const newElements = [...elements, newEl];
    setElements(newElements);
    saveToHistory(newElements);
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
      const newElements = elements.filter(el => el.id !== selectedId);
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedId(null);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    saveToHistory([]);
    setSelectedId(null);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preview = canvas.toDataURL('image/png');

    await supabase.from('designs').insert({
      name: `Diseño ${productType} - ${new Date().toLocaleDateString()}`,
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

  const tools = [
    { id: 'select' as const, icon: Move, label: 'Mover', tooltip: 'Seleccionar y mover elementos' },
    { id: 'pencil' as const, icon: Pencil, label: 'Lápiz', tooltip: 'Dibujar a mano alzada' },
    { id: 'eraser' as const, icon: Eraser, label: 'Borrador', tooltip: 'Borrar trazos' },
    { id: 'line' as const, icon: Minus, label: 'Línea', tooltip: 'Dibujar líneas rectas' },
    { id: 'text' as const, icon: Type, label: 'Texto', tooltip: 'Agregar texto' },
    { id: 'rect' as const, icon: Square, label: 'Rectángulo', tooltip: 'Dibujar rectángulo' },
    { id: 'circle' as const, icon: Circle, label: 'Círculo', tooltip: 'Dibujar círculo' },
    { id: 'image' as const, icon: Upload, label: 'Imagen', tooltip: 'Subir imagen' },
  ];

  return (
    <section id="designer" className="py-20 cyber-bg relative">
      <div className="absolute inset-0 stars-bg opacity-30" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta via-violet to-cyan" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-magenta-light text-sm font-bold uppercase tracking-widest">Designer POD</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Crea Tu Diseño Único</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Herramienta interactiva para crear bocetos de tus productos personalizados.
            Dibuja, diseña y envía tu idea a la tienda.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="card-cyber neon-border-cyan space-y-6">
            {/* Product Type */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">Producto</label>
              <div className="grid grid-cols-3 gap-2">
                {productTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setProductType(pt.id)}
                    className={`p-3 rounded-xl text-center transition-all ${productType === pt.id
                        ? 'bg-gradient-to-r from-magenta to-cyan text-white shadow-glow-magenta'
                        : 'bg-midnight text-gray-400 hover:text-white border border-cyan/20 hover:border-cyan/50'
                      }`}
                    title={pt.label}
                  >
                    <span className="text-2xl block mb-1">{pt.icon}</span>
                    <span className="text-xs font-bold">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">Herramientas</label>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (t.id === 'image') {
                        fileInputRef.current?.click();
                      } else {
                        setTool(t.id);
                      }
                    }}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${tool === t.id
                        ? 'bg-gradient-to-r from-violet to-magenta text-white shadow-glow-violet'
                        : 'bg-midnight text-gray-400 hover:text-white border border-violet/20 hover:border-violet/50'
                      }`}
                    title={t.tooltip}
                  >
                    <t.icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                ))}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Stroke Width */}
            {(tool === 'pencil' || tool === 'eraser' || tool === 'line') && (
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">
                  Grosor: {strokeWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

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
                    className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-midnight scale-110' : ''
                      }`}
                    style={{ backgroundColor: c, boxShadow: color === c ? `0 0 15px ${c}` : 'none' }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light disabled:opacity-30 text-gray-300 py-2.5 rounded-xl border border-cyan/20 hover:border-cyan/50 transition-all font-bold"
                  title="Deshacer"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex-1 flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light disabled:opacity-30 text-gray-300 py-2.5 rounded-xl border border-cyan/20 hover:border-cyan/50 transition-all font-bold"
                  title="Rehacer"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={deleteSelected}
                disabled={!selectedId}
                className="w-full flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light disabled:opacity-30 text-gray-300 py-2.5 rounded-xl border border-magenta/20 hover:border-magenta/50 transition-all font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
              <button
                onClick={clearCanvas}
                className="w-full flex items-center justify-center gap-2 bg-midnight hover:bg-midnight-light text-gray-300 py-2.5 rounded-xl border border-magenta/20 hover:border-magenta/50 transition-all font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Todo
              </button>
            </div>

            <div className="text-gray-500 text-xs space-y-1">
              <p>💡 Usa el lápiz para dibujar libremente</p>
              <p>💡 Haz clic para agregar formas</p>
              <p>💡 Arrastra para mover elementos</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3 card-cyber neon-border-magenta">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-midnight hover:bg-midnight-light text-cyan rounded-lg transition-all"
                  title="Alejar"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-gray-400 text-sm font-bold min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-2 bg-midnight hover:bg-midnight-light text-cyan rounded-lg transition-all"
                  title="Acercar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setShowOrderForm(!showOrderForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan to-cyan-light text-midnight px-4 py-2 rounded-lg font-bold hover:shadow-glow-cyan transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Hacer Pedido
              </button>
            </div>

            <div className="bg-midnight rounded-xl p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-crosshair rounded-lg shadow-glow-cyan border border-cyan/30"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${saved
                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'bg-gradient-to-r from-violet to-magenta hover:shadow-glow-magenta text-white'
                  }`}
              >
                <Save className="w-5 h-5" />
                {saved ? '¡Guardado!' : 'Guardar Diseño'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan to-cyan-light hover:shadow-glow-cyan text-midnight py-3 rounded-full font-bold transition-all"
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
