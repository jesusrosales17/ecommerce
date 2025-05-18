import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/libs/prisma';
import { requireAuth } from '@/libs/auth/auth';
import { productFormSchema } from '@/features/products/schemas/productFormSchema';
import { processMultipleImages } from '@/libs/media/image-handler';
import { Prisma, ProductStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const auth = await requireAuth();

    if (!auth.isAutenticated) {
      return auth.response;
    }

    // Obtener los datos del formulario
    const formData = await request.formData();
    const generalInformation = JSON.parse(formData.get('general')?.toString() || '{}');

    // Validar los datos básicos del producto
    const validatedData = await productFormSchema.parseAsync({
      name: generalInformation.name,
      description: generalInformation.description,
      price: generalInformation.price,
      stock: generalInformation.stock,
      isOnSale: generalInformation.isOnSale,
      salePrice: generalInformation.salePrice,
      isFeatured: generalInformation.isFeatured,
      status: generalInformation.status || 'ACTIVE',
      categoryId: generalInformation.categoryId,
    });


    // Procesamos las imágenes
    const savedImages = await processMultipleImages(formData, 'images', 'products');

    // Extraemos las especificaciones
    // const specifications = extractSpecificationsFromFormData(formData);
    const specifications = JSON.parse(formData.get('specifications')?.toString() || '[]');




    // Creamos el producto con sus relaciones
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: formData.get('description')?.toString(),
        price: validatedData.price,
        stock: validatedData.stock ?? 0,
        isOnSale: validatedData.isOnSale,
        salePrice: validatedData.salePrice,
        isFeatured: validatedData.isFeatured,
        status: validatedData.status,
        categoryId: validatedData.categoryId,
        // Creamos las imágenes relacionadas
        images: {
          create: savedImages.map(img => ({
            name: img.name
          }))
        },
        // Creamos las especificaciones relacionadas
        specifications: {
          create: specifications.map((spec: { label: string; value: string }) => ({
            name: spec.label,
            value: spec.value
          }))
        }
      },
    });

    return NextResponse.json({
      message: 'Producto creado correctamente',
      product
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error)
      return NextResponse.json({
        error: error.issues[0].message,
      }, { status: 400 });
    }

    console.error('Error inesperado al crear producto:', error);

    return NextResponse.json({
      error: 'Error al crear el producto'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Opciones de filtrado desde los query params
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const status = searchParams.get('status') || 'ACTIVE';

    // Construir las condiciones de filtrado
    const where: Prisma.ProductWhereInput = {
      NOT: {
        status: 'DELETED',
      }
    };

    if (category) {
      where.categoryId = category;
    }

    if (featured) {
      where.isFeatured = true;
    }

    // if (status !== 'ALL') {
    //   where.status = status as ProductStatus;
    // }

    // Obtener los productos con sus relaciones
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        images: true,
        specifications: true,
      }
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error('Error al obtener productos:', error);

    return NextResponse.json({
      error: 'Error al obtener los productos'
    }, { status: 500 });
  }
}