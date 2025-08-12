import { DateTime } from 'luxon';
import type { TZ } from './api';

export function toISOInTZ(localDateTime: string, tz: TZ): string {
  // localDateTime viene de <input type="datetime-local"> (sin zona)
  // Lo interpretamos en la zona elegida, y devolvemos ISO sin segundos/ms
  const dt = DateTime.fromISO(localDateTime, { zone: tz });
  if (!dt.isValid) throw new Error('Invalid datetime');
  return dt.toISO({ suppressSeconds: true, suppressMilliseconds: true })!;
}

export function localToUTCLiteral(localDateTime: string, tz: TZ): string {
  // localDateTime viene de <input type="datetime-local"> (sin zona)
  // Lo interpretamos en la zona elegida, convertimos a UTC y agregamos Z
  const dt = DateTime.fromISO(localDateTime, { zone: tz });
  if (!dt.isValid) throw new Error('Invalid datetime');
  
  // Convertir a UTC y agregar Z para UTC literal
  return dt.toUTC().toISO({ suppressSeconds: true, suppressMilliseconds: true })!.replace(/\.\d{3}Z$/, 'Z');
}

export function formatDisplay(iso: string, timezone?: TZ): string {
  // iso viene del backend con zona horaria (ej: "2025-08-13T07:00-04:00")
  // Si se proporciona timezone, lo usamos para asegurar la conversión correcta
  if (timezone) {
    const dt = DateTime.fromISO(iso, { zone: timezone });
    if (dt.isValid) {
      return dt.toFormat('yyyy-LL-dd HH:mm');
    }
  }
  
  // Fallback: interpretar directamente el ISO
  const dt = DateTime.fromISO(iso);
  if (!dt.isValid) throw new Error('Invalid ISO string');
  return dt.toFormat('yyyy-LL-dd HH:mm');
}
