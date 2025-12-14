// utils/cardBrands.ts

export const CARD_BRANDS = [
  {
    name: 'visa',
    pattern: /^4[0-9]{6,}$/,
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    name: 'mastercard',
    pattern:
      /^(5[1-5][0-9]{5,}|2(2[2-9][0-9]{4,}|[3-6][0-9]{5,}|7[01][0-9]{4,}|720[0-9]{3,}))$/,
    gradient: 'from-red-600 to-red-800',
  },
  {
    name: 'amex',
    pattern: /^3[47][0-9]{5,}$/,
    gradient: 'from-cyan-600 to-cyan-800',
  },
  {
    name: 'discover',
    pattern:
      /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))[0-9]*$/,
    gradient: 'from-orange-600 to-orange-800',
  },
  {
    name: 'unionpay',
    pattern: /^62[0-9]{14,17}$/,
    gradient: 'from-red-500 to-red-700',
  },
  {
    name: 'jcb',
    pattern: /^(3528|3529|35[3-8][0-9])[0-9]*$/,
    gradient: 'from-sky-600 to-sky-800',
  },
  {
    name: 'diners',
    pattern: /^(36|38|30[0-5])[0-9]*$/,
    gradient: 'from-amber-600 to-amber-800',
  },

  // ✅ Western Union (default / fallback)
  {
    name: 'westernunion',
    pattern: /.*/, // matches anything not caught above
    gradient: 'from-yellow-500 to-yellow-700',
  },
];

export const detectCardBrand = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s/g, '');

  for (const brand of CARD_BRANDS) {
    if (brand.pattern.test(cleaned)) {
      return { brand: brand.name, bgGradient: brand.gradient };
    }
  }

  // This should never be hit now, but kept for safety
  return { brand: 'westernunion', bgGradient: 'from-yellow-500 to-yellow-700' };
};
