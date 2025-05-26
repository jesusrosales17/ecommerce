
export const formattedPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };

/**
 * Format a price with additional options
 */
export const formatPrice = (
  price: number | string,
  options: {
    currency?: string;
    notation?: Intl.NumberFormatOptions['notation'];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) => {
  const {
    currency = 'MXN',
    notation = 'standard',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(price));
};

// Formatter for consistent price formatting
export const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});