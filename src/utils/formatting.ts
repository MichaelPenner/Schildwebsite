/**
 * Formatiert einen Centbetrag als Euro-String
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/**
 * Formatiert ein ISO-Datum als deutschen Datumsstring
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

/**
 * Formatiert eine Maßangabe in mm
 */
export function formatDimension(mm: number): string {
  return `${mm} mm`;
}
