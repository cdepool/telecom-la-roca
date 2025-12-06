import { Calendar, Clock, Shield, Star } from 'lucide-react';
import { AppointmentForm } from './AppointmentForm';

export function AppointmentsSection() {
  return (
    <section id="appointments" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Citas</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Agenda Tu Cita</h2>
          <p className="text-gray-400 mt-4">
            Reserva tu turno y te atendemos sin esperas
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Calendar className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Reserva Online</h3>
              <p className="text-gray-400 text-sm">
                Elige el dia y hora que mejor te convenga desde cualquier dispositivo
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Clock className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Sin Esperas</h3>
              <p className="text-gray-400 text-sm">
                Llegando a tu cita te atendemos inmediatamente
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Shield className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Garantia</h3>
              <p className="text-gray-400 text-sm">
                90 dias de garantia en todas las reparaciones
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Star className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Calidad</h3>
              <p className="text-gray-400 text-sm">
                Repuestos originales y tecnicos certificados
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700">
            <AppointmentForm />
          </div>
        </div>
      </div>
    </section>
  );
}
