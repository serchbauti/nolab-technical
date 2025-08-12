import { DateTime } from 'luxon';
import type { TZ } from './api';

export function toISOInTZ(localDateTime: string, tz: TZ): string {
  // localDateTime comes from <input type="datetime-local"> (without zone)
  // We interpret it in the chosen zone, and return ISO without seconds/ms
  const dt = DateTime.fromISO(localDateTime, { zone: tz });
  if (!dt.isValid) throw new Error('Invalid datetime');
  return dt.toISO({ suppressSeconds: true, suppressMilliseconds: true })!;
}

export function localToUTCLiteral(localDateTime: string, tz: TZ): string {
  // localDateTime comes from <input type="datetime-local"> (without zone)
  // We interpret it in the chosen zone, convert to UTC and add Z
  const dt = DateTime.fromISO(localDateTime, { zone: tz });
  if (!dt.isValid) throw new Error('Invalid datetime');
  
  // Convert to UTC and add Z for UTC literal
  return dt.toUTC().toISO({ suppressSeconds: true, suppressMilliseconds: true })!.replace(/\.\d{3}Z$/, 'Z');
}

export function formatDisplay(iso: string, timezone?: TZ): string {
  // iso comes from backend with timezone (e.g., "2025-08-13T07:00-04:00")
  // If timezone is provided, we use it to ensure correct conversion
  if (timezone) {
    const dt = DateTime.fromISO(iso, { zone: timezone });
    if (dt.isValid) {
      return dt.toFormat('yyyy-LL-dd HH:mm');
    }
  }
  
  // Fallback: interpret ISO directly
  const dt = DateTime.fromISO(iso);
  if (!dt.isValid) throw new Error('Invalid ISO string');
  return dt.toFormat('yyyy-LL-dd HH:mm');
}
