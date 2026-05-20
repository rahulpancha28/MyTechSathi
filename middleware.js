import { NextResponse } from "next/server"
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

// Routes that require the user to be logged in (any role)
const protectedUserRoutes = ['/checkout', '/orders', '/order-details', '/profile', '/my-account']

// API routes that require authentication
const protectedApiRoutes = ['/api/payment', '/api/user-order', '/api/profile']

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')

        // Check if the current route is a protected user route
        const isProtectedUserRoute = protectedUserRoutes.some(route => pathname.startsWith(route))

        // Check if the current route is a protected API route
        const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))

        if (!hasToken) {
            // Block unauthenticated API requests with a 401 JSON response
            if (isProtectedApiRoute) {
                return NextResponse.json({ success: false, message: 'Unauthorized. Please login.' }, { status: 401 })
            }

            // Redirect unauthenticated users trying to access protected pages to login
            if (isProtectedUserRoute || pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            }

            // Allow access to auth routes if not logged in
            if (pathname.startsWith('/auth')) {
                return NextResponse.next()
            }

            return NextResponse.next()
        }

        // verify token 
        const access_token = request.cookies.get('access_token').value
        const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))

        const role = payload.role

        // prevent logged-in users from accessing auth routes 
        if (pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl))
        }

        // protect admin route  
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        // protect user-only routes (not admin)
        if (isProtectedUserRoute && role !== 'user') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        // protect user-only API routes
        if (isProtectedApiRoute && role !== 'user' && role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
        }

        return NextResponse.next()

    } catch (error) {
        console.log(error)
        const pathname = request.nextUrl.pathname

        // Return JSON error for API routes with invalid tokens
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ success: false, message: 'Unauthorized. Invalid session.' }, { status: 401 })
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