import { useState, useEffect } from 'react';
import { BarChart3, ShoppingBag, Calendar, Package, Settings, LogOut, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingAppointments: number;
  totalProducts: number;
}

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  scheduled_date: string;
  status: string;
  device_info: string;
}

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'appointments' | 'products'>('overview');
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pendingAppointments: 0, totalProducts: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    const [ordersRes, appointmentsRes, productsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('scheduled_date', { ascending: false }),
      supabase.from('products').select('id', { count: 'exact' }),
    ]);

    const ordersData = ordersRes.data || [];
    const appointmentsData = appointmentsRes.data || [];
    
    setOrders(ordersData);
    setAppointments(appointmentsData);
    
    setStats({
      totalOrders: ordersData.length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      pendingAppointments: appointmentsData.filter(a => a.status === 'pending').length,
      totalProducts: productsRes.count || 0,
    });
    
    setLoading(false);
  }

  async function updateAppointmentStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchData();
  }

  async function updateOrderStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchData();
  }

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'orders', label: 'Ordenes', icon: ShoppingBag },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'products', label: 'Productos', icon: Package },
  ];

  return (
    <div className="fixed inset-0 bg-midnight z-50 overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-64 bg-midnight-light border-r border-cyan/20 flex flex-col">
        <div className="p-6 border-b border-cyan/20">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">Admin Panel</h2>
          <p className="text-gray-400 text-sm">Telecom La Roca</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-magenta to-cyan text-white shadow-glow-magenta'
                  : 'text-gray-400 hover:text-white hover:bg-midnight border border-transparent hover:border-cyan/30'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-cyan/20 space-y-2">
          <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-cyan hover:bg-midnight border border-transparent hover:border-cyan/30 transition-all font-bold">
            <Settings className="w-5 h-5" />
            Volver al Sitio
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-magenta-light hover:text-magenta hover:bg-midnight border border-transparent hover:border-magenta/30 transition-all font-bold">
            <LogOut className="w-5 h-5" />
            Cerrar Sesion
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 cyber-bg">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-10 h-10 border-4 border-magenta border-t-transparent rounded-full shadow-glow-magenta" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-2xl font-black text-white mb-8">Panel de Control</h1>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card-cyber neon-border-cyan">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-cyan icon-glow" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-cyan" />
                    </div>
                    <p className="text-gray-400 text-sm font-bold">Ingresos Totales</p>
                    <p className="text-2xl font-black text-cyan text-glow-cyan">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  
                  <div className="card-cyber neon-border-magenta">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-magenta/10 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-magenta-light icon-glow" />
                      </div>
                      <span className="text-magenta-light text-sm font-bold">+{stats.totalOrders}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-bold">Ordenes</p>
                    <p className="text-2xl font-black text-white">{stats.totalOrders}</p>
                  </div>
                  
                  <div className="card-cyber" style={{ borderColor: 'rgba(139, 92, 246, 0.5)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-violet/10 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-violet icon-glow" />
                      </div>
                      <span className="text-violet text-sm font-bold">Pendientes</span>
                    </div>
                    <p className="text-gray-400 text-sm font-bold">Citas Pendientes</p>
                    <p className="text-2xl font-black text-white">{stats.pendingAppointments}</p>
                  </div>
                  
                  <div className="card-cyber neon-border-cyan">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-cyan icon-glow" />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm font-bold">Productos Activos</p>
                    <p className="text-2xl font-black text-white">{stats.totalProducts}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card-cyber neon-border-magenta">
                    <h3 className="text-lg font-bold text-white mb-4">Ordenes Recientes</h3>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-cyan/10 last:border-0">
                        <div>
                          <p className="text-white text-sm font-medium">{order.customer_email}</p>
                          <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-cyan font-bold">${order.total_amount}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="card-cyber neon-border-cyan">
                    <h3 className="text-lg font-bold text-white mb-4">Proximas Citas</h3>
                    {appointments.filter(a => a.status === 'pending').slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between py-3 border-b border-magenta/10 last:border-0">
                        <div>
                          <p className="text-white text-sm font-medium">{apt.customer_name}</p>
                          <p className="text-gray-500 text-xs">{apt.device_info}</p>
                        </div>
                        <span className="text-magenta-light text-sm font-bold">
                          {new Date(apt.scheduled_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-2xl font-black text-white mb-8">Gestion de Ordenes</h1>
                <div className="card-cyber overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-midnight-light">
                      <tr>
                        <th className="text-left text-cyan p-4 text-sm font-bold">Cliente</th>
                        <th className="text-left text-cyan p-4 text-sm font-bold">Total</th>
                        <th className="text-left text-cyan p-4 text-sm font-bold">Estado</th>
                        <th className="text-left text-cyan p-4 text-sm font-bold">Fecha</th>
                        <th className="text-left text-cyan p-4 text-sm font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-cyan/10">
                          <td className="p-4 text-white">{order.customer_email}</td>
                          <td className="p-4 text-cyan font-bold">${order.total_amount}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'paid' ? 'bg-cyan/20 text-cyan' :
                              order.status === 'pending' ? 'bg-violet/20 text-violet' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-midnight border border-cyan/30 rounded-lg px-3 py-1.5 text-white text-sm focus:border-cyan focus:outline-none"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="paid">Pagado</option>
                              <option value="processing">Procesando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <h1 className="text-2xl font-black text-white mb-8">Gestion de Citas</h1>
                <div className="card-cyber overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-midnight-light">
                      <tr>
                        <th className="text-left text-magenta-light p-4 text-sm font-bold">Cliente</th>
                        <th className="text-left text-magenta-light p-4 text-sm font-bold">Dispositivo</th>
                        <th className="text-left text-magenta-light p-4 text-sm font-bold">Fecha</th>
                        <th className="text-left text-magenta-light p-4 text-sm font-bold">Estado</th>
                        <th className="text-left text-magenta-light p-4 text-sm font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="border-t border-magenta/10">
                          <td className="p-4">
                            <p className="text-white font-medium">{apt.customer_name}</p>
                            <p className="text-gray-500 text-sm">{apt.customer_email}</p>
                          </td>
                          <td className="p-4 text-gray-400">{apt.device_info || 'N/A'}</td>
                          <td className="p-4 text-gray-400">
                            {new Date(apt.scheduled_date).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              apt.status === 'completed' ? 'bg-cyan/20 text-cyan' :
                              apt.status === 'confirmed' ? 'bg-violet/20 text-violet' :
                              apt.status === 'pending' ? 'bg-magenta/20 text-magenta-light' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={apt.status}
                              onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                              className="bg-midnight border border-magenta/30 rounded-lg px-3 py-1.5 text-white text-sm focus:border-magenta focus:outline-none"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmada</option>
                              <option value="completed">Completada</option>
                              <option value="cancelled">Cancelada</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h1 className="text-2xl font-black text-white mb-8">Gestion de Productos</h1>
                <div className="card-cyber neon-border-violet p-8 text-center">
                  <Package className="w-16 h-16 text-violet mx-auto mb-4 icon-glow" />
                  <p className="text-gray-400 font-bold">Panel de productos proximamente...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
