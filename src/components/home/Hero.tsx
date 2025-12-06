import { ArrowRight, Smartphone, Palette, Truck } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen cyber-bg pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 stars-bg opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-magenta/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-magenta/20 text-magenta-light px-4 py-2 rounded-full text-sm font-bold mb-6 border border-magenta/30">
              <span className="w-2 h-2 bg-magenta rounded-full animate-pulse shadow-glow-magenta" />
              Ofertas Cyber Monday Activas
            </div>
            
            {/* Logo prominente */}
            <div className="mb-6 lg:mb-8">
              <img 
                src="/logo-cyan.png" 
                alt="Telecom La Roca" 
                className="h-20 md:h-28 w-auto mx-auto lg:mx-0 drop-shadow-[0_0_30px_rgba(255,0,204,0.4)]"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Tu Dispositivo, Nuestra
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-magenta via-violet to-cyan animate-shimmer" style={{ backgroundSize: '200% auto' }}> Prioridad</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
              Reparaciones profesionales de celulares y productos personalizados. 
              Calidad garantizada, precios justos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={() => onNavigate('products')}
                className="btn-cyberpunk flex items-center justify-center gap-2 text-lg"
              >
                Comprar Ahora
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onNavigate('appointments')}
                className="flex items-center justify-center gap-2 bg-midnight-light hover:bg-violet/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all border border-cyan/30 hover:border-cyan hover:shadow-glow-cyan"
              >
                Agendar Cita
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center group">
                <div className="w-14 h-14 bg-cyan/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-cyan/30 group-hover:shadow-glow-cyan transition-all">
                  <Smartphone className="w-7 h-7 text-cyan icon-glow" />
                </div>
                <span className="text-gray-400 text-sm">Reparacion Experta</span>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-magenta/30 group-hover:shadow-glow-magenta transition-all">
                  <Palette className="w-7 h-7 text-magenta-light icon-glow" />
                </div>
                <span className="text-gray-400 text-sm">Productos POD</span>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-violet/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-violet/30 group-hover:shadow-glow-violet transition-all">
                  <Truck className="w-7 h-7 text-violet icon-glow" />
                </div>
                <span className="text-gray-400 text-sm">Envio Rapido</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex justify-center lg:justify-end">
            <CountdownTimer />
          </div>
        </div>
      </div>
    </section>
  );
}
