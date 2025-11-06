import { z } from "zod";

export const passwordSchema = z.object({
  length: z.coerce
    .number()
    .min(4, "Minimum password length is 4.")
    .max(32, "Maximum password length is 32."),
  quantity: z.coerce
    .number()
    .min(1, "Minimum quantity is 1.")
    .max(500, "Maximum quantity is 500."),
  requiredOptions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message:
        "Select at least one option: uppercase, lowercase, number, or symbol",
    }),
  optionalOptions: z.array(z.string()),
});
