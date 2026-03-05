import { addMinutes, isAfter, isBefore } from "date-fns";
import { fromZonedTime } from 'date-fns-tz'; // Ensure the correct import
import { dbx } from "./data";
import { BOOKING_WINDOW_DAYS, BUSINESS_HOURS, LEAD_TIME_HOURS, SLOT_INCREMENT_MINUTES, getBusinessTimezone } from "./config";

export type Slot = { start: string; end: string };

function parseTime(date: string, time: string, tz: string) {
  return fromZonedTime(`${date}T${time}:00`, tz);
}

function zonedToUtc(date: Date, tz: string): Date {
  // Convert zoned time to UTC manually using fromZonedTime function
  const zonedDate = fromZonedTime(date.toISOString(), tz);
  return new Date(zonedDate.getTime()); // Convert the zonedDate back to UTC
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
      // Manually convert zoned time to UTC using the new function
      slots.push({
        start: zonedToUtc(slotStart, tz).toISOString(),
        end: zonedToUtc(slotEnd, tz).toISOString(),
      });
    }

    cursor = addMinutes(cursor, SLOT_INCREMENT_MINUTES);
  }
  return slots;
}
