import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ onClose, onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Carrito Vacio</h3>
          <p className="text-gray-400 mb-6">Agrega productos para continuar</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Tu Carrito ({items.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 bg-gray-800 rounded-xl p-4">
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                {item.product.category === 'fundas' ? '📱' : 
                 item.product.category === 'ropa' ? '👕' : '🔌'}
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium">{item.product.name}</h4>
                <p className="text-orange-400 font-bold">
                  ${item.product.discount_price || item.product.price}
                </p>
                
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="ml-auto text-red-400 hover:text-red-300 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-bold text-xl">${getTotal().toFixed(2)}</span>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Proceder al Pago
          </button>
          
          <button
            onClick={clearCart}
            className="w-full mt-3 text-gray-400 hover:text-white text-sm"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
