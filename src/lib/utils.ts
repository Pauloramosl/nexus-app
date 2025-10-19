import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRelativeDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const formatter = new Intl.RelativeTimeFormat('pt-BR', {
    numeric: 'auto',
  });

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const ranges: Array<{
    limit: number;
    divisor: number;
    unit: Intl.RelativeTimeFormatUnit;
  }> = [
    { limit: 60, divisor: 1, unit: 'minute' },
    { limit: 24, divisor: 60, unit: 'hour' },
    { limit: 7, divisor: 24, unit: 'day' },
    { limit: 4.34524, divisor: 7, unit: 'week' },
    { limit: 12, divisor: 4.34524, unit: 'month' },
  ];

  let value = diffMinutes;
  let unit: Intl.RelativeTimeFormatUnit = 'minute';

  for (const range of ranges) {
    if (Math.abs(value) < range.limit) {
      unit = range.unit;
      return formatter.format(Math.round(value), unit);
    }

    value /= range.divisor;
  }

  // Se passou de "meses", convertemos para anos
  value /= 12;
  unit = 'year';
  return formatter.format(Math.round(value), unit);
}
