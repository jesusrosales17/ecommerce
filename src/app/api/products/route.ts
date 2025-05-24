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
      brand: generalInformation.brand,
      color: generalInformation.color,
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


    if(!specifications || specifications.length === 0) {
      return NextResponse.json({ error: 'Las especificaciones son obligatorias' }, { status: 400 });
    }
    
    const description = formData.get('description')?.toString();
    if (!description) {
      return NextResponse.json({ error: 'La descripción es obligatoria' }, { status: 400 });
    }

    // Creamos el producto con sus relaciones
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: description,
        price: validatedData.price,
        stock: validatedData.stock ?? 0,
        brand: validatedData.brand,
        color: validatedData.color,
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
    const categoryName = searchParams.get('categoryName');
    const categoryId = searchParams.get('categoryId');
    const isOnSale = searchParams.get('onSale') ;
    const featured = searchParams.get('featured') ;
    const status = searchParams.get('status') || 'ACTIVE';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '0');
    const page = parseInt(searchParams.get('page') || '1');


    

    // Construir las condiciones de filtrado
    const where: Prisma.ProductWhereInput = {
      NOT: {
        status: 'DELETED',
      }
    };

    if (categoryName) {
      where.category = { name: categoryName };
    }
    if( categoryId) {
      where.categoryId = categoryId;
    }

    if (featured) {
      where.isFeatured = true;
    }
    if (isOnSale) {
      where.isOnSale = true;
    }

    if (status !== 'ALL') {
      where.status = status as ProductStatus;
    }

    if (minPrice) {
      where.price = {
        gte: parseFloat(minPrice)
      };
    }
    if (maxPrice) {
      where.price = {
        lte: parseFloat(maxPrice)
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Obtener el total de productos para la paginación
    // const total = await prisma.product.count({ where });

    // Obtener los productos con sus relaciones
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit || undefined,
      skip: limit ? (page - 1) * limit : undefined,
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