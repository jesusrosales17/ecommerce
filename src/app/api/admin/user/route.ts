import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Devolver solo los datos necesarios para el UI
    const userData = {
      name: session.user.name || "Usuario",
      email: session.user.email || "",
      image: session.user.image || null,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
