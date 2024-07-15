"use client";
import { IProductDTO } from "@/dtos/IProductDTO";
import { useProducts } from "@/contexts/ProductsContext";
import { PackageSearch, Pencil } from "lucide-react";

interface IProps {
  product: IProductDTO
}

export default function ProductItem({ product }: IProps) {
  const { handleSetSelectedProduct } = useProducts()

  const formCurrency = (value: number | string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(Number(value))
  }

  return (
    <div className="flex flex-col group w-60 h-80 gap-2 p-4 border border-zinc-300 rounded-lg">
      <div className="flex justify-center">
        <PackageSearch size={80} strokeWidth={0.4} />
      </div>


      <div className="line-clamp-2 break-words font-medium text-sm mt-4 text-zinc-800"> {product.name}</div>

      <div className="line-clamp-2 break-words text-xs text-zinc-500"> {product.description} </div>

      <div className="flex line-clamp-3 break-words font-medium text-lg text-green-600 mt-auto mb-4"> {formCurrency(product.price)}</div>

      <div
        onClick={() => handleSetSelectedProduct(product)}
        className="flex items-center gap-1 justify-center invisible group-hover:visible hover:cursor-pointer text-center text-sm text-zinc-700">
        Editar
        <Pencil size={15} />
      </div>
    </div>
  );
}
