import React from 'react';

interface MojaFlowLogoProps {
  className?: string;
  size?: number | string;
  showBorder?: boolean;
}

export const MojaFlowLogo: React.FC<MojaFlowLogoProps> = ({
  className = 'w-9 h-9',
  showBorder = true,
}) => {
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center transition-transform hover:scale-105 select-none ${
        showBorder ? 'ring-1 ring-white/20 shadow-md shadow-black/50' : ''
      } ${className}`}
      title="MojaFlow AI"
    >
      <img
        src="/mojaflow-logo.svg"
        alt="MojaFlow AI Logo"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default MojaFlowLogo;
