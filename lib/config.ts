export const SLOT_INCREMENT_MINUTES = 30;
export const LEAD_TIME_HOURS = 2;
export const BOOKING_WINDOW_DAYS = 30;
export const BUSINESS_HOURS = {
  mon: { start: "09:00", end: "17:00" },
  tue: { start: "09:00", end: "17:00" },
  wed: { start: "09:00", end: "17:00" },
  thu: { start: "09:00", end: "17:00" },
  fri: { start: "09:00", end: "17:00" },
  sat: { start: "09:00", end: "17:00" },
  sun: null,
} as const;

export function getBusinessTimezone() {
  return process.env.BUSINESS_TIMEZONE || "Europe/Athens";
}
