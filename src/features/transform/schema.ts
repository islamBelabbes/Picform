import { z } from "zod";

const format = z.enum(["png", "jpg", "webp"]);

export const transformSchema = z.object({
  path: z.custom<`${string}.${z.infer<typeof format>}`>(
    (val) => {
      if (typeof val !== "string") return false;
      return /\.(png|jpg|webp)$/i.test(val);
    },
    {
      message: "Path must end with .png, .jpg, or .webp",
    }
  ),
  options: z.object({
    width: z.coerce.number().min(100).max(1920).optional(),
    height: z.coerce.number().min(100).max(1080).optional(),
    quality: z.coerce.number().min(1).max(100).optional(),
    format: format.optional(),
  }),
});

export type Transform = z.infer<typeof transformSchema>;
