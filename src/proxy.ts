import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get(SESSION_COOKIE)
    const sessionSecret = process.env.ADMIN_SESSION_SECRET

    if (!session || session.value !== sessionSecret) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
