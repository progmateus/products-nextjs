import { AppError } from "@/errors/AppError";
import { Product } from "@/models/Product";

class DeleteProuctUseCase {
  async handle(id: number): Promise<void> {
    const product = await Product.findOne({
      where: {
        id
      }
    })

    if (!product) {
      throw new AppError("ERR_PRODUCT_NOT_FOUND");
    }

    await product.destroy();
  }
}

export { DeleteProuctUseCase };