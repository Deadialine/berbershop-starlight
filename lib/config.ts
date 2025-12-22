export const SLOT_INCREMENT_MINUTES = 30;
export const LEAD_TIME_HOURS = 2;
export const BOOKING_WINDOW_DAYS = 30;
export const BUSINESS_HOURS = {
  mon: { start: "10:00", end: "19:00" },
  tue: { start: "10:00", end: "19:00" },
  wed: { start: "10:00", end: "19:00" },
  thu: { start: "10:00", end: "19:00" },
  fri: { start: "10:00", end: "19:00" },
  sat: { start: "10:00", end: "19:00" },
  sun: null,
} as const;

export function getBusinessTimezone() {
  return process.env.BUSINESS_TIMEZONE || "America/New_York";
}
