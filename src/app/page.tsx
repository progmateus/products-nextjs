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
import { useRouter } from 'next/navigation'
import { AxiosError } from "axios";


const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Min 3 caracteres").max(200, "Max 200 caracteres")
});

type SignInProps = z.infer<typeof signInSchema>

export default function SignIn() {
  const { register, formState: { errors, isValid }, getValues } = useForm<SignInProps>({
    resolver: zodResolver(signInSchema)
  });

  const router = useRouter()

  const { signIn } = useAuth()

  const [isError, setIsError] = useState(false)

  const handleSignIn = () => {
    if (!isValid) {
      setIsError(!isValid)
      return;
    }
    signIn({
      email: getValues("email"),
      password: getValues("password")
    }).catch((err) => {
      if (err !== "Error: NEXT_REDIRECT") {
        setIsError(true)
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col gap-10 p-16  border border-zinc-300 rounded-md">
        <h1 className="text-center text-xl font-semibold text-zinc-800">Fazer Login</h1>
        <Input label="E-mail" type="email" errorMessage={errors.email?.message} {...register("email")} />
        <Input label="Senha" errorMessage={errors.password?.message} {...register("password")} />
        <div className="flex h-10 mt-4">
          <Button title="ENTRAR" onClick={handleSignIn} />
        </div>
        <div className="text-sm text-red-600 -mt-8"> {isError ? "E-mail ou senha inválidos" : ""}</div>
        <div className="text-center text-sm font-light -mt-4 text-zinc-600"> Ainda não tem acesso?</div>
        <div className="flex h-10 -mt-4">
          <Button title="CADASTRE-SE" classes="bg-blue-400 hover:bg-blue-500" onClick={() => router.push("/signup")} />
        </div>
      </div>
    </main>
  );
}
