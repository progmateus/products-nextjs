'use client'
import Image from "next/image";
import { PackageSearch, Pencil } from 'lucide-react';
import PageHeader from "@/components/pageHeader/PageHeader";
import ProductItem from "@/components/ProductItem";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/Input/Input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { CreateUserService } from "@/services/usersService";

const signUpSchema = z.object({
  name: z.string().min(3, "min 3 caracteres").max(80, "max 80 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Min 3 caracteres").max(200, "Max 200 caracteres")
});

type SignUpProps = z.infer<typeof signUpSchema>

export default function SignUp() {
  const { register, handleSubmit, formState: { errors, isValid }, setError } = useForm<SignUpProps>({
    resolver: zodResolver(signUpSchema)
  });
  const { signIn } = useAuth()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = (data: SignUpProps) => {
    if (isLoading) return
    setIsLoading(true)
    CreateUserService(data).then((res) => {
      signIn({
        email: data.email,
        password: data.password
      })
    }).catch((err) => {
      const { response: { data: { message } } } = err
      if (message === "ERR_USER_ALREADY_EXISTS") {
        setError("email", {
          message: "Este E-mail já está em uso"
        })
      }
      console.log(err);
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-6 p-16  border border-zinc-300 rounded-md">
        <h1 className="text-center text-xl font-semibold text-zinc-800 mb-4">Criar Conta</h1>
        <Input label="Nome" errorMessage={errors.name?.message} {...register("name")} />
        <Input label="E-mail" errorMessage={errors.email?.message} {...register("email")} />
        <Input label="Senha" errorMessage={errors.password?.message} {...register("password")} />
        <div className="flex h-10 mt-4">
          <Button title="CRIAR CONTA" type="submit" />
        </div>
      </form>
    </main>
  );
}
