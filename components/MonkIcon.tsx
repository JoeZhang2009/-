
import React from 'react';

interface MonkIconProps {
  className?: string;
}

const MonkIcon: React.FC<MonkIconProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* 光環背景 */}
      <circle cx="100" cy="90" r="75" fill="#FEF3C7" />
      
      {/* 身體/僧袍 (外層) */}
      <path 
        d="M60 140C60 120 70 110 100 110C130 110 140 120 140 140L155 175C155 185 145 190 135 190H65C55 190 45 185 45 175L60 140Z" 
        fill="#78350F" 
      />
      
      {/* 內層僧袍 (黃色) */}
      <path 
        d="M75 115C75 115 90 110 100 110C110 110 125 115 125 115L135 190H65L75 115Z" 
        fill="#FBBF24" 
      />

      {/* 頭部 */}
      <circle cx="100" cy="75" r="55" fill="#FDE68A" />
      <circle cx="100" cy="75" r="55" fill="#FFE4A1" fillOpacity="0.5" />
      
      {/* 耳朵 */}
      <circle cx="45" cy="80" r="12" fill="#FDE68A" />
      <circle cx="155" cy="80" r="12" fill="#FDE68A" />

      {/* 眉毛 */}
      <path d="M75 65C80 60 85 60 90 65" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
      <path d="M110 65C115 60 120 60 125 65" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />

      {/* 眼睛 (笑眼) */}
      <path d="M70 80C75 75 85 75 90 80" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
      <path d="M110 80C115 75 125 75 130 80" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />

      {/* 腮紅 */}
      <circle cx="70" cy="95" r="8" fill="#FCA5A5" fillOpacity="0.4" />
      <circle cx="130" cy="95" r="8" fill="#FCA5A5" fillOpacity="0.4" />

      {/* 鼻子 */}
      <path d="M98 88C100 90 102 88" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />

      {/* 嘴巴 */}
      <path d="M90 100C95 105 105 105 110 100" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />

      {/* 手部 (合十感) */}
      <path d="M90 135C90 130 95 125 100 125C105 125 110 130 110 135V145H90V135Z" fill="#FDE68A" />
      <circle cx="100" cy="135" r="4" fill="#F59E0B" />
    </svg>
  );
};

export default MonkIcon;
