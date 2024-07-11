import { Product } from "@/models/Product";

class CreateProductUseCase {
  async handle({ name, description, price, userId }: ICreateProductDTO): Promise<Product> {
    return await Product.create({
      name,
      description,
      price,
      userId
    })
  }
}

export { CreateProductUseCase };