"use client";
import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-30T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Pre-Launch Countdown</h3>
        <p className="text-blue-100">Time until early access begins</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {timeUnits.map((unit, index) => (
          <div key={index} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2">
              <div className="text-3xl font-bold">
                {unit.value.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="text-sm text-blue-100 font-medium">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <p className="text-blue-100 text-sm">
          December 30, 2025 - Be among the first to experience ZyberHero
        </p>
      </div>
    </div>
  );
}