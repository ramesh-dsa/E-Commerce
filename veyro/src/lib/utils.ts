/**
 * Formats a numeric price into an Indian Rupee string (e.g. ₹1,499)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates discount percentage between original price and sale price
 */
export function calculateDiscountPercentage(
  price: number,
  originalPrice: number
): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
