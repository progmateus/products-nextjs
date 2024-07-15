"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { redirect } from "next/navigation"
import { api } from "@/services/apiClient";
import { GetUserProfileService } from "@/services/usersService";
import { useRouter } from 'next/navigation'


type User = {
  id?: string;
  name?: string;
  email: string;
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User | undefined;
  setProfileUser: () => void
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel;

export function signOut(broadcast: boolean = true) {
  destroyCookie(undefined, "products-challenge.token")
  destroyCookie(undefined, "products-challenge.refreshToken")

  if (broadcast) {
    authChannel.postMessage('signOut');
  }
  redirect("/signin")
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User>();
  const router = useRouter()
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'super-price.token': token } = parseCookies();

    if (token) {
      GetUserProfileService().then((res) => {
        const { id, name, email } = res.data;
        setUser({
          id,
          name,
          email,
        })
      }).catch(() => {
        signOut();
      })
    }
  }, [])

  useEffect(() => {

    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut(false);
          break;
        case 'signIn':
          const { 'products-challenge.token': token } = parseCookies()
          if (token) {
            router.push('/products')
          }
        default:
          break
      }
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {

    const response = await api.post("/auth/login", {
      email,
      password
    })

    const { user, token, refresh_token } = response.data

    setCookie(undefined, "products-challenge.token", token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/"
    });

    setCookie(undefined, "products-challenge.refreshToken", refresh_token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/"
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    authChannel.postMessage('signIn');

    await setProfileUser();

    redirect("/products");
  }

  async function setProfileUser() {
    GetUserProfileService().then((res) => {
      const { id, name, email } = res.data;
      setUser({
        id,
        name,
        email,
      })
    })
  }

  return (
    <AuthContext.Provider value={{ signOut, signIn, isAuthenticated, user, setProfileUser }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)