import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { categorySchema } from "@/features/categories/schemas/categorySchema";
import { z } from "zod";
import { requireAuth } from "@/libs/auth/auth";
import { saveImage } from "@/libs/media/image-handler";
import { CategoryStatus, Prisma } from "@prisma/client";

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
    const imageFile = formData.get('image');

    // Validate data
    const validatedData = categorySchema.parse({
      name,
      description,
      status,
      image: imageFile
    });

    // Save the image if provided
    let imageData = null;
    if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = (imageFile as File).name || 'image.jpg';
      imageData = await saveImage(buffer, filename, 'categories');
    }   // Create category in the database with necessary fields
    // We'll use a type assertion to handle the mismatch until Prisma client can be updated
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        status: validatedData.status as CategoryStatus,
        // Using any to bypass TypeScript error until Prisma client is regenerated
        image: imageData?.name || "placeholder.jpg",
      },
    });

    return NextResponse.json({
      message: "Categoría creada correctamente",
      category,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
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

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'ACTIVE';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '0');
    const page = parseInt(searchParams.get('page') || '1');

    // Build filtering conditions
    const where: Prisma.CategoryWhereInput = {
      NOT: {
        status: 'DELETED',
      }
    };

    // Apply status filter (unless status is 'ALL')
    if (status !== 'ALL') {
      where.status = status as CategoryStatus;
    }

    // Apply search filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Get categories with filtering, sorting, and pagination
    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit || undefined,
      skip: limit ? (page - 1) * limit : undefined,
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: {
                  not: 'DELETED'
                }
              }
            }
          }
        }
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