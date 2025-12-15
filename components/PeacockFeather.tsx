import React from 'react';

export const PeacockFeather: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stem */}
    <path d="M50 100 Q 50 50 80 10" stroke="#fbbf24" strokeWidth="1" opacity="0.8" />
    
    {/* Eye of the feather - Outer Ring */}
    <ellipse cx="75" cy="25" rx="15" ry="20" fill="#047857" opacity="0.9" />
    
    {/* Eye of the feather - Middle Ring */}
    <ellipse cx="75" cy="25" rx="10" ry="14" fill="#fbbf24" opacity="0.8" />
    
    {/* Eye of the feather - Inner Core */}
    <ellipse cx="75" cy="25" rx="5" ry="7" fill="#1e3a8a" />
    
    {/* Barbs/Fronds */}
    <path d="M50 90 Q 70 60 90 50" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
    <path d="M50 85 Q 65 55 85 45" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
    <path d="M50 80 Q 60 50 80 40" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
    
    <path d="M50 90 Q 30 60 10 50" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
    <path d="M50 85 Q 35 55 15 45" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
    <path d="M50 80 Q 40 50 20 40" stroke="#047857" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

export const PeacockBackground: React.FC = () => (
  <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none opacity-10">
      <PeacockFeather className="w-full h-full transform translate-x-10 -translate-y-10" />
  </div>
);