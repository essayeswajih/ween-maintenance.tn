import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const authRoutes = ['/account']
// Routes that require admin role
const adminRoutes = ['/admin']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('access_token')?.value
    const role = request.cookies.get('user_role')?.value

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

    // 1. If trying to access admin routes
    if (isAdminRoute) {
        if (!token || role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 2. If trying to access general authenticated routes
    if (isAuthRoute) {
        if (!token) {
            const url = new URL('/login', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }
    }

    // 3. Prevent logged-in users from visiting login/register pages
    if ((pathname === '/login' || pathname === '/register') && token) {
        return NextResponse.redirect(new URL('/account', request.url))
    }

    return NextResponse.next()
}

// Config to match routes
export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
        '/checkout/:path*',
        '/checkout/:path*',
        '/login',
        '/register',
    ],
}
