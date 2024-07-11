import { AppError } from "@/errors/AppError"
import { User } from "@/models/User"
import { hash } from "bcryptjs"

class CreateUserUseCase {
  async handle({ name, email, password }: ICreateUserDTO) {
    const user = await User.findOne({
      where: {
        email: email.toLowerCase()
      }
    })

    if (user) {
      throw new AppError("ERR_USER_ALERADY_EXISTS", 409)
    }

    const passwordHash = await hash(password, 8)

    await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash
    })
  }
}

export { CreateUserUseCase }