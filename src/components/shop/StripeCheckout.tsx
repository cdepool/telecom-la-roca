import { useState } from 'react';
import { ArrowLeft, MessageCircle, Check, Lock, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../lib/supabase';

interface CheckoutProps {
  onBack: () => void;
}

export function StripeCheckout({ onBack }: CheckoutProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Save order to Supabase first (for record keeping)
      const { error: orderError } = await supabase.from('orders').insert({
        total_amount: getTotal(),
        customer_email: form.email,
        items: items.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.discount_price || item.product.price,
          quantity: item.quantity,
        })),
        shipping_address: {
          name: form.name,
          line1: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
        },
        status: 'whatsapp_pending', // Custom status to indicate initiated via WhatsApp
        payment_method: 'whatsapp'
      });

      if (orderError) {
        console.error('Error saving order:', orderError);
        // We continue even if save fails, as the primary goal is WhatsApp
      }

      // 2. Construct WhatsApp Message
      const lineItems = items.map(item =>
        `• ${item.product.name} (x${item.quantity}) - $${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}`
      ).join('\n');

      const message = `*NUEVO PEDIDO WEB* 🛍️\n\n` +
        `*Cliente:* ${form.name}\n` +
        `*Teléfono:* ${form.phone}\n` +
        `*Email:* ${form.email}\n` +
        `*Dirección:* ${form.address}, ${form.city}, ${form.state}\n\n` +
        `*--- DETALLE DEL PEDIDO ---*\n` +
        `${lineItems}\n\n` +
        `*TOTAL: $${getTotal().toFixed(2)}*\n\n` +
        `_Enviado desde el formulario web_`;

      // 3. Encode and Redirect
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/584245896062?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');

      setSuccess(true);
      clearCart();

    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">¡Pedido Iniciado!</h2>
          <p className="text-gray-400 mb-8">
            Se ha abierto WhatsApp para completar tu pedido. Si no se abrió automáticamente, verifica tus ventanas emergentes.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-green-500" />
          Finalizar Pedido vía WhatsApp
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Información de Contacto</h3>

              <div className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  required
                  placeholder="Teléfono (WhatsApp)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Dirección de Entrega</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Dirección exacta"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Estado"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Código Postal"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6" />
              {loading ? 'Procesando...' : 'Enviar Pedido por WhatsApp'}
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Lock className="w-4 h-4" />
              Tus datos son usados solo para el pedido
            </div>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-800 rounded-xl p-6 h-fit border border-gray-700 sticky top-4">
            <h3 className="text-white font-semibold mb-4">Resumen del Pedido</h3>

            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-gray-900/50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {item.product.category === 'fundas' ? '📱' :
                      item.product.category === 'ropa' ? '👕' : '🔌'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{item.product.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">Cantidad: {item.quantity}</p>
                    <div className="text-green-400 font-bold text-sm mt-1">
                      ${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span className="text-green-400">A coordinar</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-700 mt-2">
                <span>Total Estimado</span>
                <span className="text-green-400">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm flex gap-2">
                <MessageCircle className="w-5 h-5 shrink-0" />
                Al hacer clic en enviar, se abrirá WhatsApp con los detalles de tu pedido para finalizar la compra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
