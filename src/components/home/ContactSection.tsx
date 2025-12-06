import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, Navigation } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';

const StoreMap = lazy(() => import('../maps/StoreMap').then(m => ({ default: m.StoreMap })));

export function ContactSection() {
  const [mapLoaded, setMapLoaded] = useState(false);

  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/dir/?api=1&destination=9.5545,-69.1956', '_blank');
  };

  return (
    <section id="contact" className="py-20 cyber-bg relative">
      <div className="absolute inset-0 stars-bg opacity-30" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan via-violet to-magenta" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-cyan text-sm font-bold uppercase tracking-widest">Contacto</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Estamos Para Ayudarte</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-cyber neon-border-cyan text-center group hover:shadow-glow-cyan transition-all">
            <div className="w-14 h-14 bg-cyan/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-cyan transition-all">
              <MapPin className="w-7 h-7 text-cyan icon-glow" />
            </div>
            <h3 className="text-white font-bold mb-2">Ubicación</h3>
            <p className="text-gray-400 text-sm">Centro Comercial Latin Center<br />Local 10-11, Av. 33</p>
            <button 
              onClick={openGoogleMaps}
              className="mt-3 inline-flex items-center gap-1 text-cyan hover:text-magenta text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3 h-3" />
              Cómo llegar
            </button>
          </div>

          <div className="card-cyber neon-border-magenta text-center group hover:shadow-glow-magenta transition-all">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-magenta transition-all">
              <Phone className="w-7 h-7 text-magenta-light icon-glow" />
            </div>
            <h3 className="text-white font-bold mb-2">Teléfono</h3>
            <p className="text-gray-400 text-sm">(+58) 424-5896062<br />WhatsApp disponible</p>
            <a 
              href="tel:+584245896062"
              className="mt-3 inline-flex items-center gap-1 text-magenta hover:text-cyan text-xs font-semibold transition-colors"
            >
              Llamar ahora
            </a>
          </div>

          <div className="card-cyber text-center group hover:shadow-glow-violet transition-all" style={{ borderColor: 'rgba(139, 92, 246, 0.5)' }}>
            <div className="w-14 h-14 bg-violet/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-violet transition-all">
              <Mail className="w-7 h-7 text-violet icon-glow" />
            </div>
            <h3 className="text-white font-bold mb-2">Email</h3>
            <p className="text-gray-400 text-sm">info@telecomlaroca.com<br />soporte@telecomlaroca.com</p>
          </div>

          <div className="card-cyber neon-border-cyan text-center group hover:shadow-glow-cyan transition-all">
            <div className="w-14 h-14 bg-cyan/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-cyan transition-all">
              <Clock className="w-7 h-7 text-cyan icon-glow" />
            </div>
            <h3 className="text-white font-bold mb-2">Horario</h3>
            <p className="text-gray-400 text-sm">Lun - Sab: 8am - 6pm<br />Dom: 9am - 4pm</p>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-xl">Encuéntranos</h3>
            {!mapLoaded && (
              <button 
                onClick={() => setMapLoaded(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan to-magenta px-4 py-2 rounded-lg text-white font-semibold text-sm hover:shadow-glow-cyan transition-all"
              >
                <MapPin className="w-4 h-4" />
                Ver Mapa Interactivo
              </button>
            )}
          </div>
          
          {mapLoaded ? (
            <Suspense fallback={
              <div className="h-[500px] rounded-2xl bg-midnight/50 border border-cyan/30 flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-cyan border-t-transparent rounded-full" />
              </div>
            }>
              <StoreMap variant="full" showDirections showSearch />
            </Suspense>
          ) : (
            <div 
              onClick={() => setMapLoaded(true)}
              className="h-64 rounded-2xl bg-gradient-to-br from-midnight to-gray-900 border border-cyan/30 flex flex-col items-center justify-center cursor-pointer hover:border-magenta transition-all group"
            >
              <div className="w-20 h-20 bg-cyan/10 rounded-full flex items-center justify-center mb-4 group-hover:shadow-glow-cyan transition-all">
                <MapPin className="w-10 h-10 text-cyan" />
              </div>
              <p className="text-gray-400 text-sm">Centro Comercial Latin Center, Local 10-11</p>
              <p className="text-gray-500 text-xs mt-1">Acarigua, Estado Portuguesa</p>
              <button className="mt-4 text-cyan hover:text-magenta font-semibold text-sm transition-colors">
                Click para ver el mapa →
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="card-cyber neon-border-magenta text-center">
          <h3 className="text-white font-bold text-lg mb-6">Síguenos en Redes Sociales</h3>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/larocacasetech/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-br from-magenta to-violet rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-glow-magenta transition-all"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="#"
              className="w-14 h-14 bg-gradient-to-br from-cyan to-cyan-light rounded-xl flex items-center justify-center text-midnight hover:scale-110 hover:shadow-glow-cyan transition-all"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a
              href="https://wa.me/584245896062"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-br from-violet to-magenta rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-glow-violet transition-all"
            >
              <MessageCircle className="w-7 h-7" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-cyan/20">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
              <img 
                src="/logo-black.png" 
                alt="La Roca" 
                className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity"
                style={{ filter: 'invert(1) brightness(0.8)' }}
              />
            </div>
            
            {/* Contact Information */}
            <div className="text-center">
              <div className="text-white text-sm font-semibold mb-2">Telecom La Roca</div>
              <p className="text-gray-400 text-xs">
                Centro Comercial Latin Center, Local 10-11, Av. 33
              </p>
              <p className="text-gray-400 text-xs">
                Acarigua, Estado Portuguesa, Venezuela
              </p>
              <p className="text-cyan text-xs font-semibold">
                (+58) 424-5896062
              </p>
              <p className="text-gray-500 text-xs mt-2">
                &copy; 2025 Telecom La Roca.<br />Todos los derechos reservados.
              </p>
            </div>
            
            {/* Mini Map Link */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={openGoogleMaps}
                className="flex items-center gap-2 text-gray-400 hover:text-cyan text-sm transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Acarigua, Venezuela</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
