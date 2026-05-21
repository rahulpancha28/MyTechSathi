import { NextResponse } from "next/server"
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

const ALLOWED_ORIGINS = [
    'https://www.mytechsathi.com',
    'https://mytechsathi.com',
    'https://my-tech-sathi.vercel.app',
]

// Routes that require the user to be logged in (any role)
const protectedUserRoutes = ['/checkout', '/orders', '/order-details', '/profile', '/my-account']
// API routes that require authentication
const protectedApiRoutes = ['/api/payment', '/api/user-order', '/api/profile']

export async function middleware(request) {
    const origin = request.headers.get('origin') ?? ''
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin)

    // Handle CORS preflight — must come BEFORE any auth logic
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    // Helper to add CORS headers to any response
    const withCors = (response) => {
        if (isAllowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', origin)
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        }
        return response
    }

    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')

        const isProtectedUserRoute = protectedUserRoutes.some(route => pathname.startsWith(route))
        const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))

        if (!hasToken) {
            if (isProtectedApiRoute) {
                return withCors(NextResponse.json({ success: false, message: 'Unauthorized. Please login.' }, { status: 401 }))
            }
            if (isProtectedUserRoute || pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            }
            if (pathname.startsWith('/auth')) {
                return withCors(NextResponse.next())
            }
            return withCors(NextResponse.next())
        }

        const access_token = request.cookies.get('access_token').value
        const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))
        const role = payload.role

        if (pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl))
        }
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }
        if (isProtectedUserRoute && role !== 'user') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }
        if (isProtectedApiRoute && role !== 'user' && role !== 'admin') {
            return withCors(NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 }))
        }

        return withCors(NextResponse.next())

    } catch (error) {
        console.log(error)
        const pathname = request.nextUrl.pathname
        if (pathname.startsWith('/api/')) {
            return withCors(NextResponse.json({ success: false, message: 'Unauthorized. Invalid session.' }, { status: 401 }))
        }
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/my-account/:path*',
        '/auth/:path*',
        '/checkout/:path*',
        '/orders/:path*',
        '/order-details/:path*',
        '/profile/:path*',
        '/api/payment/:path*',
        '/api/user-order/:path*',
        '/api/profile/:path*',
    ]
}