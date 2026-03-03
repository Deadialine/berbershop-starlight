import { addMinutes, isAfter, isBefore } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { dbx } from "./data";
import { BOOKING_WINDOW_DAYS, BUSINESS_HOURS, LEAD_TIME_HOURS, SLOT_INCREMENT_MINUTES, getBusinessTimezone } from "./config";

export type Slot = { start: string; end: string };

function parseTime(date: string, time: string, tz: string) {
  return zonedTimeToUtc(`${date}T${time}:00`, tz);
}

export async function getAvailableSlots(date: string, serviceDuration: number) {
  const tz = getBusinessTimezone();
  const weekday = new Date(date).toLocaleString("en-US", { weekday: "short", timeZone: tz }).toLowerCase().slice(0, 3) as keyof typeof BUSINESS_HOURS;
  const hours = BUSINESS_HOURS[weekday];
  if (!hours) return [];

  const windowEnd = addMinutes(new Date(), BOOKING_WINDOW_DAYS * 24 * 60);
  const leadTime = addMinutes(new Date(), LEAD_TIME_HOURS * 60);
  const dayStart = parseTime(date, hours.start, tz);
  const dayEnd = parseTime(date, hours.end, tz);

  if (isAfter(dayStart, windowEnd)) return [];

  const slots: Slot[] = [];
  let cursor = dayStart;
  while (isBefore(addMinutes(cursor, serviceDuration), addMinutes(dayEnd, 1))) {
    const slotStart = cursor;
    const slotEnd = addMinutes(cursor, serviceDuration);

    if (isBefore(slotStart, leadTime)) {
      cursor = addMinutes(cursor, SLOT_INCREMENT_MINUTES);
      continue;
    }
    if (isAfter(slotStart, windowEnd)) break;

    if (!dbx.hasConflictingAppointment(slotStart.toISOString(), slotEnd.toISOString())) {
      slots.push({
        start: utcToZonedTime(slotStart.toISOString(), tz).toISOString(),
        end: utcToZonedTime(slotEnd.toISOString(), tz).toISOString(),
      });
    }

    cursor = addMinutes(cursor, SLOT_INCREMENT_MINUTES);
  }
  return slots;
}
