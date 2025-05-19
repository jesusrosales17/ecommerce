import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { categorySchema } from "@/features/categories/schemas/categorySchema";
import { z } from "zod";
import { getSession, requireAuth } from "@/libs/auth/auth";
import { saveImage } from "@/libs/media/image-handler";

export async function POST(request: NextRequest) {
  try {
    // Verificar si el usuario está autenticado
    const auth = await requireAuth();

    if (!auth.isAutenticated) {
      return auth.response;
    }

    // Parse formData
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || undefined;
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File;

    // Validate data
    const validatedData = categorySchema.parse({
      name,
      description,
      status,
      image: imageFile
    });
    
    // Save the image if provided
    let imageData = null;
    if (imageFile) {
      imageData = await saveImage(imageFile, 'categories');
    }    // Create category in the database with necessary fields
    // We'll use a type assertion to handle the mismatch until Prisma client can be updated
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        status: validatedData.status as any,
        // Using any to bypass TypeScript error until Prisma client is regenerated
        image: imageData?.name || "placeholder.jpg",
      } as any,
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