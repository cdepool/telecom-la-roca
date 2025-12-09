import { useState, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { ServicesSection } from './components/home/ServicesSection';
import { ProductsSection } from './components/home/ProductsSection';
import { FabricDesigner } from './components/designer/FabricDesigner';
import { AppointmentsSection } from './components/appointments/AppointmentsSection';
import { ContactSection } from './components/home/ContactSection';
import { Cart } from './components/shop/Cart';
import { StripeCheckout } from './components/shop/StripeCheckout';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './lib/auth';
import { Settings } from 'lucide-react';

function App() {
  const { user, isAdmin } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const homeRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<HTMLDivElement>(null);
  const appointmentsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    if (section === 'cart') {
      setShowCart(true);
      return;
    }

    if (section === 'admin' && isAdmin) {
      setShowAdmin(true);
      return;
    }

    if (section === 'login') {
      setShowAuth(true);
      return;
    }

    setShowCart(false);
    setShowCheckout(false);

    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      home: homeRef,
      services: servicesRef,
      products: productsRef,
      designer: designerRef,
      appointments: appointmentsRef,
      contact: contactRef,
    };

    const ref = refs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onNavigate={handleNavigate} />

      {/* Admin Button for admins */}
      {isAdmin && (
        <button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
          title="Panel de Administración"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}

      <main>
        <div ref={homeRef}>
          <Hero onNavigate={handleNavigate} />
        </div>

        <div ref={servicesRef}>
          <ServicesSection onNavigate={handleNavigate} />
        </div>

        <div ref={productsRef}>
          <ProductsSection onNavigate={handleNavigate} />
        </div>

        <div ref={designerRef}>
          <FabricDesigner />
        </div>

        <div ref={appointmentsRef}>
          <AppointmentsSection />
        </div>

        <div ref={contactRef}>
          <ContactSection />
        </div>
      </main>

      {showCart && (
        <Cart onClose={() => setShowCart(false)} onCheckout={handleCheckout} />
      )}

      {showCheckout && (
        <StripeCheckout onBack={() => {
          setShowCheckout(false);
          handleNavigate('products');
        }} />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {showAdmin && isAdmin && (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

export default App;
