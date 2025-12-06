import { useState, useEffect } from 'react';
import { ShoppingCart, Palette, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface ProductsSectionProps {
  onNavigate: (section: string) => void;
}

export function ProductsSection({ onNavigate }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pod' | 'accessories'>('all');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filter === 'pod') return p.is_pod;
    if (filter === 'accessories') return !p.is_pod;
    return true;
  });

  const handleAddToCart = (product: Product) => {
    if (product.is_pod) {
      onNavigate('designer');
    } else {
      addItem(product);
    }
  };

  const getDiscount = (product: Product) => {
    if (!product.discount_price) return 0;
    return Math.round((1 - product.discount_price / product.price) * 100);
  };

  return (
    <section id="products" className="py-20 cyber-bg relative">
      <div className="absolute inset-0 stars-bg opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-magenta/20 text-magenta-light px-4 py-2 rounded-full text-sm font-bold mb-4 border border-magenta/30">
            <Tag className="w-4 h-4" />
            Ofertas Cyber Monday
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Nuestra Tienda</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Productos de calidad y articulos personalizados con tu diseno unico
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pod', label: 'Personalizables' },
            { id: 'accessories', label: 'Accesorios' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-magenta to-cyan text-white shadow-glow-magenta'
                  : 'bg-midnight-light text-gray-400 hover:text-white border border-cyan/20 hover:border-cyan/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-cyber h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card-cyber overflow-hidden group hover:neon-border-magenta transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-midnight-light to-midnight flex items-center justify-center rounded-xl mb-4">
                  {product.is_pod && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-violet to-magenta text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                      <Palette className="w-3 h-3" />
                      Personalizable
                    </div>
                  )}
                  {product.discount_price && (
                    <div className="absolute top-3 right-3 bg-magenta text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow-magenta">
                      -{getDiscount(product)}%
                    </div>
                  )}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan/20 to-magenta/20 flex items-center justify-center">
                    {product.category === 'fundas' ? (
                      <Smartphone className="w-10 h-10 text-cyan" />
                    ) : product.category === 'ropa' ? (
                      <svg className="w-10 h-10 text-magenta-light" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2L2 8l4 2v12h12V10l4-2-4-6H6zm2 2h8l2.67 4L12 12 5.33 8 8 4z"/></svg>
                    ) : (
                      <svg className="w-10 h-10 text-violet" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12V10H4v2l8 5 8-5zm0-7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/></svg>
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <span className="text-cyan/70 text-xs uppercase font-bold tracking-wider">{product.category}</span>
                  <h3 className="text-white font-bold mt-1 group-hover:text-cyan transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {product.discount_price ? (
                      <>
                        <span className="text-magenta-light font-black text-lg text-glow-magenta">${product.discount_price}</span>
                        <span className="text-gray-500 line-through text-sm">${product.price}</span>
                      </>
                    ) : (
                      <span className="text-white font-black text-lg">${product.price}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full mt-4 py-2.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                      product.is_pod
                        ? 'bg-gradient-to-r from-violet to-magenta hover:shadow-glow-magenta text-white'
                        : 'bg-gradient-to-r from-cyan to-cyan-light hover:shadow-glow-cyan text-midnight'
                    }`}
                  >
                    {product.is_pod ? (
                      <>
                        <Palette className="w-4 h-4" />
                        Personalizar
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Smartphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
