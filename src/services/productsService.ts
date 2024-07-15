import { IProductDTO } from "@/dtos/IProductDTO";
import { api } from "./apiClient";

export function GenerateRandomProductsService() {
  return api({
    url: '/products/generate',
    method: 'post'
  })
}

export function CreateProductService({ name, description, price }: Omit<IProductDTO, "id" | "userId">) {
  return api({
    url: '/products/',
    method: 'post',
    data: {
      name,
      description,
      price: +price
    }
  })
}

export function UpdateProductService({ name, description, id, price }: Omit<IProductDTO, "userId">) {
  return api({
    url: `/products/${id}`,
    method: 'put',
    data: {
      name,
      description,
      price: +price
    }
  })
}

export function DeleteProductService(id: string | number) {
  return api({
    url: `/products/${id}`,
    method: 'delete'
  })
}

export function ListProductsService(params?: string) {
  return api({
    url: '/products/',
    method: 'get',
    params: {
      params
    }
  })
}

export function DeleteAllProductsService() {
  return api({
    url: '/products/',
    method: 'delete',
  })
}