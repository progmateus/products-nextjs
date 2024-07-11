import { Product } from "@/models/Product";

class ListProductsUseCase {
  async handle() {
    return await Product.findAll();
  }
}

export { ListProductsUseCase };