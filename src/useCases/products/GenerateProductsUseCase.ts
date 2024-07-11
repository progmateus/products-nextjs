import { Product } from "@/models/Product";
import { faker } from '@faker-js/faker';


export function createRandomUser() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
  };
}

class GenerateProductsUseCase {
  async handle(userId: number): Promise<void> {
    const products = faker.helpers.multiple(createRandomUser, {
      count: 50,
    });

    await Product.bulkCreate(products.map(({ name, description, price }) => {
      return ({
        name,
        description,
        price,
        userId
      })
    }))
  }
}

export { GenerateProductsUseCase };