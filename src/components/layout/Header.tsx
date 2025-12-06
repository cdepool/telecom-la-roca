import { useState } from 'react';
import { Menu, X, ShoppingCart, Calendar, User, LogOut } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../lib/auth';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'services', label: 'Reparaciones' },
    { id: 'products', label: 'Tienda' },
    { id: 'designer', label: 'Personalizar' },
    { id: 'appointments', label: 'Citas' },
    { id: 'contact', label: 'Contacto' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight/95 backdrop-blur-md border-b border-cyan/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <img 
              src="/logo-cyan.png" 
              alt="La Roca" 
              className="h-12 md:h-14 w-auto transition-all group-hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="text-gray-300 hover:text-cyan transition-colors text-sm font-semibold uppercase tracking-wide relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-magenta to-cyan transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('appointments')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-magenta to-cyan hover:shadow-glow-magenta text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all"
            >
              <Calendar className="w-4 h-4" />
              Agendar Cita
            </button>
            
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2 text-gray-300 hover:text-cyan transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-magenta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-glow-magenta">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center gap-2 p-2 text-gray-300 hover:text-magenta transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="hidden sm:flex items-center gap-2 p-2 text-gray-300 hover:text-cyan transition-colors"
                title="Iniciar sesión"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-cyan"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyan/20 bg-midnight/95 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="block w-full text-left py-3 text-gray-300 hover:text-cyan transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-cyan/20 mt-3 pt-3">
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 w-full py-3 text-magenta font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => handleNav('login')}
                  className="flex items-center gap-2 w-full py-3 text-cyan font-medium"
                >
                  <User className="w-5 h-5" />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
