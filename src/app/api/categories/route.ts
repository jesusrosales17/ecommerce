import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { categorySchema } from "@/features/categories/schemas/categorySchema";
import { z } from "zod";
import { getSession, requireAuth } from "@/libs/auth/auth";

export async function POST(request: NextRequest) {

  try {
    //  verificar si el usuario esta autenticado
    const auth = await requireAuth();

    if (!auth.isAutenticated) {
      return auth.response;
    }
    // validar los datos
    const body = await request.json();
    const {name,status, description} = categorySchema.parse(body);
    
    // guardar la categoria en la bd
   
    const category = await prisma.category.create({
      data: {
        name,
        status,
        description,
      },
    });

    return NextResponse.json({
      message: "Categoría creada correctamente",
      category,
    }, { status: 201 });

  } catch (error) {
    if(error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: error.issues[0].message,
         },
        { status: 400 }
      );
    }
    console.log('Error inesperado', error);
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