"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * Función para obtener la sesión del usuario desde el servidor
 * @returns La sesión del usuario o null si no está autenticado
 */
export async function getSessionServer() {
  const session = await getServerSession(authOptions);
  console.log('session', session);
  return session;
}