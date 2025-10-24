import { z } from "zod";

export const settingSchema = z.object({
  length: z.coerce
    .number()
    .min(4, "Password must be at least 4 characters long")
    .max(32, "Password cannot exceed 32 characters"),

  quantity: z.coerce
    .number()
    .min(1, "Quantity must be at least 1")
    .max(500, "Quantity cannot exceed 500"),

  options: z.array(z.string()).refine((value) => value.some((item) => item), {
    message:
      "Select at least one option: uppercase, lowercase, number, or symbol",
  }),

  saveSetting: z.boolean().optional(),
});
