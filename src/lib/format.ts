export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** The price a customer actually pays (sale price when present). */
export function effectivePrice(p: { price: number; salePrice: number | null }): number {
  return p.salePrice ?? p.price
}
