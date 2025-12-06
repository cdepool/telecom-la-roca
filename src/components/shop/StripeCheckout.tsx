import { useState } from 'react';
import { ArrowLeft, CreditCard, Check, Lock, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../lib/supabase';

interface CheckoutProps {
  onBack: () => void;
}

const SUPABASE_URL = 'https://wasvgkxcbkfhrxauwtsj.supabase.co';

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
    card_number: '',
    card_expiry: '',
    card_cvc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create payment intent via Edge Function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotal(),
          currency: 'usd',
          customerEmail: form.email,
          cartItems: items.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.discount_price || item.product.price,
          })),
          shippingAddress: {
            name: form.name,
            line1: form.address,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        // If Stripe is not configured, fall back to simple order creation
        if (result.error.message?.includes('Stripe no configurado')) {
          // Create order without Stripe
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
            status: 'pending',
          });

          if (!orderError) {
            setSuccess(true);
            clearCart();
          } else {
            throw new Error('Error al crear orden');
          }
        } else {
          throw new Error(result.error.message);
        }
      } else {
        // Payment intent created successfully
        setSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
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
          <h2 className="text-3xl font-bold text-white mb-4">Orden Confirmada</h2>
          <p className="text-gray-400 mb-8">
            Gracias por tu compra. Recibiras un correo con los detalles de tu pedido y seguimiento.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
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
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Informacion de Contacto</h3>
              
              <div className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Telefono"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Direccion de Envio</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Direccion"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Estado"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Codigo Postal"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informacion de Pago
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Numero de tarjeta"
                  value={form.card_number}
                  onChange={(e) => setForm({ ...form, card_number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={form.card_expiry}
                    onChange={(e) => setForm({ ...form, card_expiry: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CVC"
                    value={form.card_cvc}
                    onChange={(e) => setForm({ ...form, card_cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? 'Procesando...' : `Pagar $${getTotal().toFixed(2)}`}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Lock className="w-4 h-4" />
              Pago seguro con encriptacion SSL
            </div>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-800 rounded-xl p-6 h-fit">
            <h3 className="text-white font-semibold mb-4">Resumen del Pedido</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                    {item.product.category === 'fundas' ? '📱' : 
                     item.product.category === 'ropa' ? '👕' : '🔌'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm">{item.product.name}</h4>
                    <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                  </div>
                  <span className="text-orange-400 font-semibold">
                    ${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envio</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                Cyber Monday: Envio gratis en todos los pedidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
