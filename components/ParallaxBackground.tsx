import React from 'react';

interface ParallaxSectionProps {
  children?: React.ReactNode;
  className?: string;
}

const ParallaxBackground: React.FC<ParallaxSectionProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: `url('/assets/images/bg.png.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08, // 8% opacity for subtle effect
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxBackground;