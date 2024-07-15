'use client'
import PageHeader from "@/components/pageHeader/PageHeader";
import ProductItem from "@/components/ProductItem";
import { useEffect, useState } from "react";
import { ListProductsService } from "@/services/productsService";
import { IProductDTO } from "@/dtos/IProductDTO";
import { useSearchParams } from 'next/navigation'
import { useProducts } from "@/contexts/ProductsContext";

export default function Products() {
  const { products, handleSetProducts } = useProducts()
  const searchParams = useSearchParams()

  const params = searchParams.get('params') || ""

  useEffect(() => {
    ListProductsService(params).then((res) => {
      const { data } = res
      handleSetProducts(data)
    })
  }, [params])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <div>
        <PageHeader />
      </div>
      <div className="flex flex-1 gap-2 flex-wrap w-2/4 justify-center py-16">
        {
          products && products.length > 0 ? (
            products.map((product: IProductDTO) => {
              return (
                <ProductItem key={product.id} product={product} />
              )
            })

          ) :
            (
              <div> Nenhum produto encontrado</div>
            )
        }
      </div>
      <div>
      </div>
    </main>
  );
}
