import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Cyber Monday 2025 - December 8, 2025 23:59:59
    const cyberMonday = new Date('2025-12-08T23:59:59').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = cyberMonday - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-gradient-to-br from-magenta to-violet text-white text-3xl md:text-5xl font-black w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-xl shadow-glow-magenta">
          {value.toString().padStart(2, '0')}
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-magenta to-violet rounded-xl blur-lg opacity-30 -z-10" />
      </div>
      <span className="text-cyan text-xs md:text-sm mt-3 uppercase tracking-widest font-bold">{label}</span>
    </div>
  );
  
  return (
    <div className="card-cyber p-6 md:p-8 neon-border-cyan animate-float">
      <div className="text-center mb-6">
        <span className="bg-gradient-to-r from-magenta to-cyan text-white px-5 py-1.5 rounded-full text-sm font-bold animate-glow-pulse shadow-glow-magenta">
          CYBER MONDAY
        </span>
        <h3 className="text-white text-xl md:text-2xl font-black mt-4 text-glow-cyan">Hasta 40% de Descuento</h3>
        <p className="text-gray-400 text-sm mt-1">Ofertas por tiempo limitado</p>
      </div>
      
      <div className="flex justify-center gap-3 md:gap-6">
        <TimeBlock value={timeLeft.days} label="Dias" />
        <TimeBlock value={timeLeft.hours} label="Horas" />
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <TimeBlock value={timeLeft.seconds} label="Seg" />
      </div>
    </div>
  );
}
