// components/CardIcon.tsx

import React from 'react';

const ICON_URLS: Record<string, string> = {
  visa: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visa.svg',
  mastercard: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mastercard.svg',
  amex: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/americanexpress.svg',
  discover: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/discover.svg',
  unionpay: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/unionpay.svg',
  jcb: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jcb.svg',
  diners: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dinersclub.svg',
  generic: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/creditcard.svg',
};

interface CardIconProps {
  brand: string;
  className?: string;
}

const CardIcon: React.FC<CardIconProps> = ({ brand, className }) => {
  const url = ICON_URLS[brand] || ICON_URLS['generic'];

  return (
    <img
      src={url}
      alt={brand}
      className={`h-8 w-auto object-contain opacity-90 invert brightness-200 ${
        className || ''
      }`}
    />
  );
};

export default CardIcon;