export function formatPrice(n: number): string {
  return '₱' + n.toLocaleString('en-PH')
}
