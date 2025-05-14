import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getSession } from "@/libs/auth/auth";

export async function POST(request: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getSession();
    
    if(!session) {
      return NextResponse.json(
        { error: "No estás autenticado" },
        { status: 401 }
      );
    }
  console.log(session) 
    return NextResponse.json(
      { message: "Autenticado correctamente" },
      { status: 200 }
    );
    return;
    // Obtener los datos de la categoría del body
    const body = await request.json();
    const { name, description, status } = body;

    // Validar datos
    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    // Crear la categoría en la base de datos
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        status,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: {
          not: "DELETED",
        },
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}