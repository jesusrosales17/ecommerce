import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import path from "path";

export default async function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Rutas protegidas por rol de administrador
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  
  // Obtener el token que contiene la información de la sesión
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";

 

  // Redireccionar al login si no está autenticado y no es ruta pública
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redireccionar al home si intenta acceder al login estando autenticado
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verificar acceso a rutas de administrador
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
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
    
    // Excluir archivos estáticos y API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};