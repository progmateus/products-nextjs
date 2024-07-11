import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AppError } from './errors/AppError';
import { verify } from 'jsonwebtoken';
import { auth } from './config/auth';


interface IPayload {
  sub: string
}

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    throw new AppError("ERR_TOKEN_MISSING");
  }

  if (authHeader.length > 350) {
    throw new AppError("ERR_INVALID_TOKEN", 401)
  }

  const [, token] = authHeader.split(" ");

  const { secret_token } = auth

  try {
    const { sub: user_id } = verify(
      token,
      secret_token
    ) as IPayload
    const response = NextResponse.next()
    response.headers.set("x-user-id", user_id);

    return response;
  } catch (err) {
    throw new AppError("ERR_INTERNAL_SERVER_ERROR");
  }
};

export const config = {
  matcher: '/api/users',
}