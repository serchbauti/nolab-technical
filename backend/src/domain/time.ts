import { DateTime, Interval } from 'luxon';

export type TZ = 'America/New_York' | 'Asia/Tokyo' | 'America/Mexico_City';

export const BUSINESS_START_HOUR = 9;
export const BUSINESS_END_HOUR = 17;
export const MIN_MINUTES = 30;
export const MAX_MINUTES = 120;

/** ISO local + TZ → epoch seconds (UTC) */
export function toUTC(isoLocal: string, zone: TZ): number {
  const dt = DateTime.fromISO(isoLocal, { zone });
  if (!dt.isValid) throw new Error(`Invalid datetime or timezone: ${isoLocal} (${zone})`);
  return Math.floor(dt.toUTC().toSeconds());
}

/** ISO string already in UTC → epoch seconds (UTC) */
export function fromUTCString(isoUTC: string): number {
  const dt = DateTime.fromISO(isoUTC, { zone: 'utc' });
  if (!dt.isValid) throw new Error(`Invalid UTC datetime: ${isoUTC}`);
  return Math.floor(dt.toSeconds());
}

/** epoch seconds (UTC) + TZ → ISO local in that TZ */
export function fromUTC(epochSec: number, zone: TZ): string {
  const dt = DateTime.fromSeconds(epochSec, { zone: 'utc' });
  if (!dt.isValid) throw new Error(`Invalid DateTime from epochSec: ${epochSec}`);
  return dt.setZone(zone).toISO({ suppressSeconds: true, suppressMilliseconds: true }) || '';
}

export function isBusinessDayUTC(epochSec: number): boolean {
  const dt = DateTime.fromSeconds(epochSec, { zone: 'utc' });
  return dt.weekday >= 1 && dt.weekday <= 5; // 1..5 = Mon..Fri
}

export function withinBusinessWindowUTC(startUtc: number, endUtc: number): boolean {
  const s = DateTime.fromSeconds(startUtc, { zone: 'utc' });
  const e = DateTime.fromSeconds(endUtc, { zone: 'utc' });

  if (s.hasSame(e, 'day') === false) return false; // same day
  if (!isBusinessDayUTC(startUtc)) return false;

  // Always validate in UTC business hours (09:00-17:00 UTC)
  const startBoundary = s.set({ hour: BUSINESS_START_HOUR, minute: 0, second: 0 });
  const endBoundary = s.set({ hour: BUSINESS_END_HOUR, minute: 0, second: 0 });

  return s >= startBoundary && e <= endBoundary && e > s;
}

export function durationMinutes(startUtc: number, endUtc: number): number {
  return Math.round((endUtc - startUtc) / 60);
}

export function durationValid(startUtc: number, endUtc: number): boolean {
  const d = durationMinutes(startUtc, endUtc);
  return d >= MIN_MINUTES && d <= MAX_MINUTES;
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/** Aligns to business window: if before 09:00 → 09:00; if after 17:00 → next business day 09:00 */
export function alignToBusinessWindow(startUtc: number): number {
  let dt = DateTime.fromSeconds(startUtc, { zone: 'utc' });

  // If it's weekend, jump to next Monday 09:00
  while (dt.weekday === 6 || dt.weekday === 7) {
    dt = dt.plus({ days: 1 }).set({ hour: BUSINESS_START_HOUR, minute: 0, second: 0 });
  }

  const dayStart = dt.set({ hour: BUSINESS_START_HOUR, minute: 0, second: 0 });
  const dayEnd   = dt.set({ hour: BUSINESS_END_HOUR,   minute: 0, second: 0 });

  if (dt < dayStart) return Math.floor(dayStart.toSeconds());
  if (dt >= dayEnd) {
    // Next business day at 09:00
    let next = dt.plus({ days: 1 }).set({ hour: BUSINESS_START_HOUR, minute: 0, second: 0 });
    while (next.weekday === 6 || next.weekday === 7) {
      next = next.plus({ days: 1 });
    }
    return Math.floor(next.toSeconds());
  }
  return Math.floor(dt.toSeconds());
}

/** Advances 15 minutes; if it goes past 17:00, jumps to next business day 09:00 */
export function stepForward(startUtc: number, minutes = 15): number {
  let dt = DateTime.fromSeconds(startUtc, { zone: 'utc' }).plus({ minutes });
  const endBoundary = DateTime.fromSeconds(startUtc, { zone: 'utc' }).set({ hour: BUSINESS_END_HOUR, minute: 0, second: 0 });

  if (dt >= endBoundary) {
    // next business day 09:00
    dt = dt.set({ hour: BUSINESS_START_HOUR, minute: 0, second: 0 }).plus({ days: 1 });
    while (dt.weekday === 6 || dt.weekday === 7) dt = dt.plus({ days: 1 });
  }
  return Math.floor(dt.toSeconds());
}
