import { auth } from "@/config/auth";
import { AppError } from "@/errors/AppError";
import { UsersTokens } from "@/models/UsersTokens";
import dayjs from "dayjs";
import { sign, verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refreshToken: string;
}

class RefreshTokenUseCase {
  async execute(token: string): Promise<ITokenResponse> {

    const { secret_refresh_token, refresh_token_expires_days, secret_token } = auth

    const { sub } = verify(token, secret_refresh_token) as IPayload

    const userId = sub

    const userToken = await UsersTokens.findOne({
      where: {
        userId,
        token
      }
    })

    if (!userToken) {
      throw new AppError("ERR_REFRESH_TOKEN_NOT_FOUND")
    }

    await userToken.destroy()

    const refreshToken = sign({
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    }, secret_refresh_token, {}
    )

    const expiresDate = dayjs().add(refresh_token_expires_days, "days")

    await UsersTokens.create({
      expiresDate,
      refreshToken,
      userId
    })

    const newToken = sign({
      subject: userId,
      expiresIn: auth.expires_in_token
    }, secret_token, {}
    );

    return {
      refreshToken,
      token: newToken
    }
  }
}

export { RefreshTokenUseCase };