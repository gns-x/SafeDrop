import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizes = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
  };

  return (
    <div className={`inline-flex items-center gap-6 ${className}`}>
      {/* Logo Image */}
      <div className="relative group">
        <div className={`${sizes[size]} aspect-square relative transform transition-all duration-500 group-hover:scale-105`}>
          {/* Background Glow */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-colors duration-500"></div>

          {/* Main Image */}
          <img
            src="https://fs001.classter.com/londonacademy/8537/4/2024/9/Photo/thumbnail-logo-elite-copy-ab093918-86d9-4f71-99e7-170f3773aafa.png"
            alt="London Academy Logo"
            className={`${sizes[size]} object-contain relative z-10 drop-shadow-lg transition-all duration-500 group-hover:drop-shadow-2xl`}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-blue-900 tracking-tight leading-none
            ${size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-3xl' : 'text-4xl'}`}>
            LacDrop
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
