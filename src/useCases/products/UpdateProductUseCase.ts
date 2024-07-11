import { ICreateProductDTO, productSchema } from "@/dtos/CreateProductDTO";
import { AppError } from "@/errors/AppError";
import { Product } from "@/models/Product";
import { ZodIssue } from "zod";

class CreateProductUseCase {
  async handle({ name, description, price }: ICreateProductDTO, userId: number, id: number): Promise<ZodIssue[] | Product> {
    const result = await productSchema.safeParseAsync({ name, description, price })

    if (!result.success) {
      return result.error.issues
    }
    const product = await Product.findOne({
      where: {
        id
      }
    })

    if (!product) {
      throw new AppError("ERR_PRODUCT_NOT_FOUND", 404);
    }

    product.set({
      name,
      description,
      price
    })

    await product.save();
    return product;
  }
}

export { CreateProductUseCase };