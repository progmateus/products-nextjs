import { api } from "./apiClient";
import { IUserDTO } from "@/dtos/IUserDTO";

export function GetUserProfileService() {
  return api({
    url: '/users/profile',
    method: 'get'
  })
}

export function CreateUserService({ name, email, password }: Omit<IUserDTO, "id">) {
  return api({
    url: '/users/',
    method: 'post',
    data: {
      name,
      email,
      password
    }
  })
}