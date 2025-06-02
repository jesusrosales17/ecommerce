import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/auth", "/"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // Rutas protegidas por rol de administrador
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Si es una ruta pública, permitir el acceso
  if (isPublicRoute && !isAdminRoute) {
    return NextResponse.next();
  }
  
  // Obtener el token que contiene la información de la sesión
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";

  console.log(`Pathname: ${pathname}`);
  console.log(`Is Admin Route: ${isAdminRoute}`);
  console.log(`Is Authenticated: ${isAuthenticated}`);
  console.log(`Is Admin: ${isAdmin}`);

  // Proteger rutas de administrador - solo usuarios con rol ADMIN pueden acceder
  if (isAdminRoute) {
    if (!isAuthenticated) {
      console.log("Redirecting to login - not authenticated");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    if (!isAdmin) {
      console.log("Redirecting to home - not admin");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Para otras rutas protegidas (no admin), solo verificar autenticación
  if (!isPublicRoute && !isAuthenticated) {
    console.log("Redirecting to login - protected route");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  // Continuar con la solicitud si pasa todas las verificaciones
  return NextResponse.next();
}

// Configurar las rutas que serán manejadas por el middleware
export const config = {
  matcher: [
    // Rutas que siempre pasarán por el middleware
    "/",
    "/admin/:path*", // Todas las rutas que empiezan con /admin
    "/auth/:path*", // Todas las rutas de autenticación
    
    // Excluir archivos estáticos y API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};