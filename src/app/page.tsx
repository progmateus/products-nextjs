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
      <div className="flex flex-col gap-8 border py-8 px-12 items-center border-zinc-300 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 2048 2048"><path fill="#16A34A" d="M1728 1152q26 0 45 19t19 45t-19 45t-45 19t-45-19t-19-45t19-45t45-19m-603-19q-79-54-170-81t-187-28q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 67-16 129t-48 119t-75 103t-101 83q81 29 156 80zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1280 384q79 0 149 30t122 82t83 123t30 149q0 80-30 149t-82 122t-123 83t-149 30q-65 0-128-23v151h-128v128h-128v128H896v-282l395-396q-11-46-11-90q0-79 30-149t82-122t122-83t150-30m0 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 35 9 64t21 61l-414 413v102h128v-128h128v-128h128v-91l93-92q40 23 77 39t86 16" /></svg>
        <h1 className="text-center text-xl font-semibold text-zinc-800">Fazer Login</h1>
        <div className="flex flex-col gap-10 ">
          <Input label="E-mail" type="email" errorMessage={errors.email?.message} {...register("email")} />
          <Input label="Senha" errorMessage={errors.password?.message} {...register("password")} />
        </div>
        <div className="flex h-10 mt-4 w-full">
          <Button title="ENTRAR" onClick={handleSignIn} />
        </div>
        <div className="text-sm text-red-600 -mt-8 w-"> {isError ? "E-mail ou senha inválidos" : ""}</div>
        <div className="text-center text-sm font-light -mt-4 text-zinc-600"> Ainda não tem acesso?</div>
        <div className="flex w-full h-10 -mt-4">
          <Button title="CADASTRE-SE" classes="bg-blue-700 hover:bg-blue-600" onClick={() => router.push("/signup")} />
        </div>
      </div>
    </main>
  );
}
