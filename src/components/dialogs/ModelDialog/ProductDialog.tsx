"use client";
import { DialogHTMLAttributes, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input/Input";
import { CreateProductService, UpdateProductService } from "@/services/productsService";
import "./styles.module.css"
import { useProducts } from "@/contexts/ProductsContext";

type IProps = DialogHTMLAttributes<HTMLDialogElement> & {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const createProductSchema = z.object({
  name: z.string().min(3, "Min 3 caracteres").max(80, "Max 80 caracteres"),
  description: z.string().min(3, "Min 3 caracteres").max(200, "Max 200 caracteres"),
  price: z.string().regex(/^\s*\d{1,3}([0-9])*(,\d{2}$)?/gi, "Valor inválido. apenas números (0-9) e ( , )")
});

type CreateProductProps = z.infer<typeof createProductSchema>

export const ProductDialog = ({ isOpen, setIsOpen }: IProps) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateProductProps>({
    resolver: zodResolver(createProductSchema)
  });
  const { selectedProduct, handleSetSelectedProduct, products, handleSetProducts } = useProducts()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      reset()
      if (selectedProduct) {
        setValue("name", selectedProduct.name)
        setValue("description", selectedProduct.description)
        setValue("price", String(selectedProduct.price))
      }
    } else {
      handleSetSelectedProduct(null)
    }
  }, [isOpen])

  const handleAction = (data: CreateProductProps) => {

    if (selectedProduct) {
      handleEdit(data)
    } else {
      handleCreate(data)
    }
  }


  const handleCreate = ({ name, description, price }: CreateProductProps) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true)
    CreateProductService({
      name,
      description,
      price: Number(price.replace(".", "").replace(',', '.'))
    }).then((res) => {
      const { data } = res;
      handleSetProducts([...products, data])
    }).finally(() => {
      setIsLoading(false)
      setIsOpen(false)
    })
  }

  const handleEdit = (data: CreateProductProps) => {
    if (!selectedProduct || isLoading) {
      return
    }
    setIsLoading(true)
    const { description, name, price } = data;
    UpdateProductService({
      id: selectedProduct.id,
      description,
      name,
      price: Number(price.replace(".", "").replace(',', '.'))
    }).then((res) => {
      const { data } = res;
      const productIndex = products.findIndex((p) => p.id === data.id)
      if (productIndex !== -1) {
        const productsArray = products;
        productsArray[productIndex] = data;
        handleSetProducts(productsArray)
      }
    }).finally(() => {
      setIsLoading(false)
      setIsOpen(false)
    })
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-zinc-900 bg-opacity-60">
      <form onSubmit={handleSubmit(handleAction)} className="fixed top-1/2 left-1/2 min-w-96 bg-white rounded-lg text-zinc-800 p-4 -translate-y-1/2 -translate-x-1/2" >
        <div className="flex justify-between h-8 mb-4">
          <h2> {selectedProduct ? 'Editar' : 'Cadastrar'} Produto</h2>
          <span className="hover:cursor-pointer" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24"><path fill="#212121" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg>
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <Input label="Nome" errorMessage={errors.name?.message} {...register("name")} />
          <Input label="Descrição" errorMessage={errors.description?.message} {...register("description")} />
          <Input label="Preço" errorMessage={errors.price?.message} {...register("price")} />
        </div>
        <div className="flex mt-8 h-10">
          <Button title={selectedProduct ? 'EDITAR' : 'CADASTRAR'} type="submit" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
