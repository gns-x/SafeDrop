import React from 'react';
import { Car } from 'lucide-react';

export const CarAnimation = () => {
  return (
    <div className="car-container relative w-12 h-12 pointer-events-none">
      <Car
        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-indigo-600 animate-flip"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.3))',
        }}
      />
    </div>
  );
};
