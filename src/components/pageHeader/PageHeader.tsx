"use client";
import { Suspense, useEffect, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../button/Button";
import { ProductDialog } from "../dialogs/ModelDialog/ProductDialog";
import { useProducts } from "@/contexts/ProductsContext";
import { useRouter, useSearchParams } from "next/navigation"
import { DeleteAllProductsService, GenerateRandomProductsService } from "@/services/productsService";

export default function PageHeader() {
  const [search, setSearch] = useState("")
  const { selectedProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter();
  const { handleSetProducts } = useProducts()
  const searchParams = useSearchParams()
  const params = searchParams.get('params') || ""

  useEffect(() => {
    if (selectedProduct) {
      setIsOpen(true)
    }
  }, [selectedProduct])

  const handleClickCreate = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    setSearch(params)
  }, [])

  const handleSearch = (query: string) => {
    setSearch(query)
    if (!query) return null;
    router.push(`/products?params=${query}`)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    GenerateRandomProductsService().then(({ data }) => {
      handleSetProducts(data)
    }).finally(() => {
      setIsGenerating(false)
    })
  }

  const handleDeleteAllProducts = () => {
    setIsDeleting(true)
    DeleteAllProductsService().then(() => {
      handleSetProducts([]);
    }).finally(() => {
      setIsDeleting(false)
    })
  }

  return (
    <main className="flex justify-center mt-16">
      <div className="flex flex-col h-40 w-full justify-center items-center">
        <div className="text-2xl font-medium"> Buscar </div>
        <div className="flex flex-col gap-6 justify-center w-full p-3 space-x-2 mt-8">
            <Input
              name="search"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="#212121" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
              }
            />
          <div className="h-8 flex items-center gap-2">
            <Button title="Criar" onClick={handleClickCreate} classes="h-8" />
            <Button title="Gerar" onClick={handleGenerate} classes="h-8 bg-purple-600 hover:bg-purple-500" isLoading={isGenerating} />
            <Button title="Deletar Todos" onClick={handleDeleteAllProducts} classes="w-96 h-8 bg-red-600 hover:bg-red-500" isLoading={isDeleting} />
          </div>
        </div>
      </div>
      <ProductDialog isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
    </main>
  );
}
