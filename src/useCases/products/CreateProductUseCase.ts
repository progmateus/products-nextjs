import { ICreateProductDTO, productSchema } from "@/dtos/CreateProductDTO";
import { Product } from "@/models/Product";
import { ZodIssue, z } from "zod";


class CreateProductUseCase {
  async handle({ name, description, price }: ICreateProductDTO, userId: number): Promise<ZodIssue[] | Product> {

    const result = await productSchema.safeParseAsync({ name, description, price })

    if (!result.success) {
      return result.error.issues
    }

    return await Product.create({
      name,
      description,
      price,
      userId
    })
  }
}

export { CreateProductUseCase };