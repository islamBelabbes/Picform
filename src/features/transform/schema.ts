import { z } from "zod";

export const transformSchema = z.object({
  url: z.string(),
  options: z.object({
    width: z.coerce.number().min(100).max(1920).optional(),
    height: z.coerce.number().min(100).max(1080).optional(),
    quality: z.coerce.number().min(1).max(100).optional(),
    format: z.enum(["png", "jpg", "webp"]).optional(),
  }),
});

export type Transform = z.infer<typeof transformSchema>;
