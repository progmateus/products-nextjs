"use client";

import { IProductDTO } from "@/dtos/IProductDTO";
import { ReactNode, createContext, useContext, useState } from "react";

type ProductscontextData = {
  handleSetSelectedProduct: (product: IProductDTO | null) => void;
  selectedProduct: IProductDTO | null;
  handleSetProducts: (products: IProductDTO[]) => void;
  products: IProductDTO[];
};

interface ICarsProviderProps {
  children: ReactNode
}

export const Productscontext = createContext({} as ProductscontextData);

export function ProductsProvider({ children }: ICarsProviderProps) {
  const [selectedProduct, setSelectedProduct] = useState<IProductDTO | null>(null)
  const [products, setProducts] = useState<IProductDTO[]>([])

  function handleSetSelectedProduct(product: IProductDTO | null) {
    setSelectedProduct(product)
  }

  function handleSetProducts(products: IProductDTO[]) {
    setProducts(products)
  }

  return (
    <Productscontext.Provider value={{ selectedProduct, handleSetSelectedProduct, products, handleSetProducts }}>
      {children}
    </Productscontext.Provider>
  )

}

export const useProducts = () => useContext(Productscontext)


