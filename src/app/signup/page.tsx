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
import { useRouter } from "next/navigation";

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
  const router = useRouter()
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
      <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-8 p-16 items-center border border-zinc-300 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 256 256"><path fill="#16a34a" d="M256 136a8 8 0 0 1-8 8h-16v16a8 8 0 0 1-16 0v-16h-16a8 8 0 0 1 0-16h16v-16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 8 8m-57.87 58.85a8 8 0 0 1-12.26 10.3C165.75 181.19 138.09 168 108 168s-57.75 13.19-77.87 37.15a8 8 0 0 1-12.25-10.3c14.94-17.78 33.52-30.41 54.17-37.17a68 68 0 1 1 71.9 0c20.65 6.76 39.23 19.39 54.18 37.17M108 152a52 52 0 1 0-52-52a52.06 52.06 0 0 0 52 52" /></svg>
        <h1 className="text-center text-xl font-semibold text-zinc-800 mb-4">Criar Conta</h1>
        <Input label="Nome" errorMessage={errors.name?.message} {...register("name")} />
        <Input label="E-mail" errorMessage={errors.email?.message} {...register("email")} />
        <Input label="Senha" errorMessage={errors.password?.message} {...register("password")} />
        <div className="flex w-full h-10 mt-4">
          <Button title="CRIAR CONTA" type="submit" />
        </div>
        <div className="text-sm text-red-600 -mt-8 w-"> {isError ? "E-mail ou senha inválidos" : ""}</div>
        <div className="text-center text-sm font-light -mt-4 text-zinc-600"> Já possui uma conta?</div>
        <div className="flex w-full h-10 -mt-4">
          <Button title="FAÇA LOGIN" classes="bg-blue-700 hover:bg-blue-600" onClick={() => router.push("/")} />
        </div>
      </form>
    </main>
  );
}
