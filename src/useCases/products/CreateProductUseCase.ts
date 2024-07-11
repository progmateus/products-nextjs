import { Product } from "@/models/Product";

class CreateProductUseCase {
  async handle({ name, description, price, userId }: ICreateProductDTO) {
    await Product.create({
      name,
      description,
      price,
      userId
    })
  }
}

export { CreateProductUseCase };