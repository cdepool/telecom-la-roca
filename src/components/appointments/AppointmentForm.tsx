import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Smartphone, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';

export function AppointmentForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service_id: '',
    scheduled_date: '',
    scheduled_time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    device_info: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const scheduledDateTime = new Date(`${form.scheduled_date}T${form.scheduled_time}`).toISOString();

    const { error } = await supabase.from('appointments').insert({
      service_id: form.service_id,
      scheduled_date: scheduledDateTime,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      device_info: form.device_info,
      notes: form.notes,
      status: 'pending',
    });

    if (!error) {
      // Send to GHL webhook
      const selectedService = services.find(s => s.id === form.service_id);
      try {
        await fetch('https://wasvgkxcbkfhrxauwtsj.supabase.co/functions/v1/ghl-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: form.customer_name,
            customer_email: form.customer_email,
            customer_phone: form.customer_phone,
            scheduled_date: scheduledDateTime,
            device_info: form.device_info,
            notes: form.notes,
            service_name: selectedService?.name || 'Servicio',
          }),
        });
      } catch (e) {
        console.log('GHL sync skipped');
      }
      setSubmitted(true);
    }
    setLoading(false);
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const minDate = new Date().toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Cita Agendada</h3>
        <p className="text-gray-400 mb-6">
          Hemos recibido tu solicitud. Te enviaremos un correo de confirmacion pronto.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              service_id: '',
              scheduled_date: '',
              scheduled_time: '',
              customer_name: '',
              customer_email: '',
              customer_phone: '',
              device_info: '',
              notes: '',
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Agendar Otra Cita
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Tipo de Servicio *
        </label>
        <select
          required
          value={form.service_id}
          onChange={(e) => setForm({ ...form, service_id: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.base_price}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Fecha *
          </label>
          <input
            type="date"
            required
            min={minDate}
            value={form.scheduled_date}
            onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Hora *
          </label>
          <select
            required
            value={form.scheduled_time}
            onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecciona horario</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nombre *
          </label>
          <input
            type="text"
            required
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Telefono *
          </label>
          <input
            type="tel"
            required
            value={form.customer_phone}
            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="(+58) 424-5896062"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email *
        </label>
        <input
          type="email"
          required
          value={form.customer_email}
          onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          <Smartphone className="w-4 h-4 inline mr-2" />
          Dispositivo
        </label>
        <input
          type="text"
          value={form.device_info}
          onChange={(e) => setForm({ ...form, device_info: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          placeholder="ej. iPhone 14 Pro, Samsung S23"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Notas Adicionales
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Describe el problema o cualquier detalle adicional"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-colors"
      >
        {loading ? 'Procesando...' : 'Confirmar Cita'}
      </button>
    </form>
  );
}
