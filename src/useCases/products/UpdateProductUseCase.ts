import { AppError } from "@/errors/AppError";
import { Product } from "@/models/Product";

class CreateProductUseCase {
  async handle({ id, name, description, price, userId }: ICreateProductDTO): Promise<Product> {
    const product = await Product.findOne({
      where: {
        id
      }
    })

    if (!product) {
      throw new AppError("ERR_PRODUCT_NOT_FOUND");
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