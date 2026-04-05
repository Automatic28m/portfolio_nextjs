import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is logged in and tries to go to /login, send them to /dashboard
  if (pathname === '/login' && token) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_KEY);
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
      // Token invalid, let them stay on /login
    }
  }

  // 2. Protect Admin Routes
  const protectedPaths = ['/dashboard', '/displayPortfolio', '/createPortfolio'];
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_KEY);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}