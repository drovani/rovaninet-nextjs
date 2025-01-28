export function middleware(request) {
  const path = request.nextUrl.pathname;
  const caseSensitivePath = path.toLowerCase();

  if (path !== caseSensitivePath) {
    return Response.redirect(
      new URL(caseSensitivePath, request.url)
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}
