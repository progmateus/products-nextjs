import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().min(3).max(200),
  price: z.number().min(1)
});

export type ICreateProductDTO = z.infer<typeof productSchema>;