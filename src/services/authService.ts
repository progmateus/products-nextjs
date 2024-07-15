import { api } from "./apiClient";

export function LoginService(email: string, password: string) {
  return api({
    url: '/auth/login',
    method: 'get',
    data: {
      email,
      password
    }
  })
}