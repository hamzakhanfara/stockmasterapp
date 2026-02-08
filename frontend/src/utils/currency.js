import i18n from '../i18n';

export const formatCurrency = (value, options = {}) => {
  const amount = typeof value === 'string' ? parseFloat(value) : Number(value || 0);
  const lang = i18n?.language || 'en';
  const locale = lang === 'ar' ? 'ar' : 'en';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
      ...options,
    }).format(amount);
  } catch (e) {
    // Fallback if Intl fails or unsupported
    return `OMR ${amount.toFixed(3)}`;
  }
};

export default formatCurrency;
