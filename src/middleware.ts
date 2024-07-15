import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/products')) {
    if (!request.cookies.has("products-challenge.token")) {
      console.log('entrou no primeiro if')
      return NextResponse.rewrite(new URL('/', request.url))
    }
  }

  if (request.cookies.has("products-challenge.token")) {
    console.log('entrou no segundo if')
    return NextResponse.rewrite(new URL('/products', request.url))
  }

  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}