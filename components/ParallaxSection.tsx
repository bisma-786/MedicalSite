import React from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  image?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = "",
  image = "/assets/images/medical-bg.png"
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Layer 1: Background with fixed attachment */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.42, // Increased visibility by 10% more
        }}
      />

      {/* Layer 2: Solid white overlay with reduced opacity to allow more background visibility */}
      <div className="absolute inset-0 z-10 bg-white bg-opacity-40" />

      {/* Layer 3: Content with full opacity and high z-index */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;