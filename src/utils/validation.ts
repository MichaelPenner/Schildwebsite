/**
 * Validiert eine URL
 */
export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validiert einen Text gegen maximale Länge
 */
export function isValidText(text: string, maxLength: number): boolean {
  return text.length > 0 && text.length <= maxLength;
}

/**
 * Validiert Maße innerhalb der Grenzen
 */
export function isValidDimension(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validiert E-Mail (einfache Prüfung)
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validiert deutsche Postleitzahl
 */
export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

/**
 * Sanitisiert eine URL für QR-Codes
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
