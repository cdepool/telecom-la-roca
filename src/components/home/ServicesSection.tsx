import { useState, useEffect } from 'react';
import { Wrench, Clock, Shield, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';

interface ServicesSectionProps {
  onNavigate: (section: string) => void;
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });

      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-20 bg-midnight-light relative">
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta via-violet to-cyan" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-cyan text-sm font-bold uppercase tracking-widest">Servicios</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Reparaciones Profesionales</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Expertos en reparación de dispositivos móviles con garantía y precios competitivos
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-cyber neon-border-cyan group hover:neon-border-magenta transition-all">
            <div className="w-14 h-14 bg-cyan/10 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-cyan transition-all">
              <Wrench className="w-8 h-8 text-cyan icon-glow" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Técnicos Certificados</h3>
            <p className="text-gray-400 text-sm">Personal altamente capacitado con años de experiencia</p>
          </div>
          <div className="card-cyber neon-border-magenta group hover:shadow-glow-magenta transition-all">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-magenta transition-all">
              <Clock className="w-8 h-8 text-magenta-light icon-glow" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Servicio Rápido</h3>
            <p className="text-gray-400 text-sm">Mayoría de reparaciones listas el mismo día</p>
          </div>
          <div className="card-cyber neon-border-violet group hover:shadow-glow-violet transition-all" style={{ borderColor: 'rgba(139, 92, 246, 0.5)' }}>
            <div className="w-14 h-14 bg-violet/10 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-violet transition-all">
              <Shield className="w-8 h-8 text-violet icon-glow" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Garantía Incluida</h3>
            <p className="text-gray-400 text-sm">Todas las reparaciones incluyen garantía de 90 días</p>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-cyber h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="card-cyber cursor-pointer group hover:neon-border-cyan transition-all"
                onClick={() => onNavigate('appointments')}
              >
                <h3 className="text-white font-bold mb-2 group-hover:text-cyan transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {service.base_price > 0 ? (
                      <span className="text-magenta-light font-black text-lg">${service.base_price}</span>
                    ) : (
                      <span className="text-cyan font-bold">GRATIS</span>
                    )}
                    <span className="text-gray-500 text-sm ml-2">~{service.duration_minutes} min</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('appointments')}
            className="btn-cyberpunk"
          >
            Agendar Cita de Reparación
          </button>
        </div>
      </div>
    </section>
  );
}
