import { z } from "zod";

export const appointmentSchema = z
  .object({
    serviceId: z.string().min(1),
    slotStart: z.string().min(1),
    customerName: z.string().min(2),
    customerPhone: z.string().min(7).optional().or(z.literal("")),
    customerEmail: z.string().email().optional().or(z.literal("")),
    note: z.string().max(500).optional(),
  })
  .refine((v) => !!(v.customerPhone || v.customerEmail), {
    message: "Provide phone or email",
    path: ["customerPhone"],
  });

export const lookupSchema = z.object({
  code: z.string().min(4),
  phone: z.string().min(7).optional(),
});

export const adminServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  durationMinutes: z.number().int().min(15),
  priceText: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const blockSchema = z.object({
  id: z.string().optional(),
  startAt: z.string(),
  endAt: z.string(),
  reason: z.string().max(200).optional(),
});

export const appointmentAdminSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email().optional().or(z.literal("")),
  note: z.string().max(500).optional(),
  startAt: z.string(),
  endAt: z.string(),
  status: z.enum(["BOOKED", "CANCELLED", "COMPLETED", "NOSHOW"]),
  serviceId: z.string(),
});

export const reviewSchema = z.object({
  name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(600),
  appointmentId: z.string().optional(),
});
