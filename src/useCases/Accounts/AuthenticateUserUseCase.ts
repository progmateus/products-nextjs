import { User } from "@/models/User";
import { auth } from "../../config/auth"
import { AppError } from "@/errors/AppError";
import { compare } from "bcryptjs";
import dayjs from "dayjs"
import { UsersTokens } from "@/models/UsersTokens";
import { sign } from "jsonwebtoken";

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    id: number,
    email: string
  },
  token: string;
  refresh_token: string;
}

class AuthenticateUserUseCase {
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const {
      expires_in_token,
      expires_in_refresh_token,
      refresh_token_expires_days,
      secret_token,
      secret_refresh_token
    } = auth

    const user = await User.findOne({
      where: {
        email: email.toLowerCase()
      }
    });

    if (!user) {
      throw new AppError("ERR_INVALID_CREDENTIALS", 401)
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("ERR_INVALID_CREDENTIALS", 401)
    }

    const token = sign({
      subject: user.id,
      expiresIn: expires_in_token
    }, secret_token, {});

    const refresh_token = sign({
      subject: user.id,
      expiresIn: expires_in_refresh_token
    }, secret_refresh_token, {})

    const refresh_token_expires_date = dayjs().add(refresh_token_expires_days, "days")

    await UsersTokens.create({
      userId: user.id,
      refreshToken: refresh_token,
      expiresDate: refresh_token_expires_date
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        id: user.id,
        email: user.email
      },
      refresh_token,

    };

    return tokenReturn
  }
}

export { AuthenticateUserUseCase };