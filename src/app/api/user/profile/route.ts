import { NextResponse } from "next/server";
import { getSession } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";

// GET: Obtener datos del perfil del usuario
export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar datos del perfil del usuario
export async function PUT(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username } = body;

    // Validar datos
    if (!name || !username) {
      return NextResponse.json(
        { error: "Nombre y nombre de usuario son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el username ya existe (excepto el usuario actual)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está en uso" },
        { status: 409 }
      );
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        username: username.trim(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
