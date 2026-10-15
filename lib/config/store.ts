export const STORE_CURRENCY = 'USD';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: STORE_CURRENCY,
  }).format(amount);
}
