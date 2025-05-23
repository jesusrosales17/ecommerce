import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/libs/prisma';
import { requireAuth } from '@/libs/auth/auth';
import { productFormSchema } from '@/features/products/schemas/productFormSchema';
import { processMultipleImages, deleteImage } from '@/libs/media/image-handler';
import { ProductSpecification } from '@prisma/client';

interface Params {
  params: Promise<{
    id: string;
  }> 
}

// Obtener un producto por ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: {
        id,
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

    if (!product) {
      return NextResponse.json({
        error: 'El producto no existe',
      }, { status: 404 });
    }

    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    
    return NextResponse.json({
      error: 'Error al obtener el producto',
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    // 1. Autenticación
    const auth = await requireAuth();
    if (!auth.isAutenticated) return auth.response;

    const { id } = await params;

    // 2. Verificar existencia del producto
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        specifications: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'El producto no existe' }, { status: 404 });
    }

    // 3. Extraer y validar datos
    const formData = await request.formData();
    const generalInformation = JSON.parse(formData.get('general')?.toString() || '{}');

    const validatedData = await productFormSchema.parseAsync({
      name: generalInformation.name,
      description: generalInformation.description,
      price: generalInformation.price,
      stock: generalInformation.stock,
      isOnSale: generalInformation.isOnSale,
      salePrice: generalInformation.salePrice,
      isFeatured: generalInformation.isFeatured,
      status: generalInformation.status || existingProduct.status,
      categoryId: generalInformation.categoryId,
    });

    // 4. Preparar imágenes a eliminar
    const imagesToDelete = JSON.parse(formData.get('imagesToDelete')?.toString() || '[]');

    const filesToDelete = existingProduct.images
      .filter(img => imagesToDelete.includes(img.name))
      .map(img => img.name);

    // 5. Procesar nuevas imágenes
    const newImages = await processMultipleImages(formData, 'images', 'products');

    // 6. Procesar especificaciones
    const specifications = JSON.parse(formData.get('specifications')?.toString() || '[]');

    if(!specifications || specifications.length === 0) {
      return NextResponse.json({ error: 'Las especificaciones son obligatorias' }, { status: 400 });
    }

    const description = formData.get('description')?.toString();

    
    if(!description) {   
      return NextResponse.json({ error: 'La descripción es obligatoria' }, { status: 400 });
    }
    // 7. Ejecutar transacción
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 7.1 Actualizar producto principal
      const product = await tx.product.update({
        where: { id },
        data: {
          name: validatedData.name,
          description: description,
          price: validatedData.price,
          stock: validatedData.stock ?? existingProduct.stock,
          isOnSale: validatedData.isOnSale,
          salePrice: validatedData.salePrice,
          isFeatured: validatedData.isFeatured,
          status: validatedData.status,
          categoryId: validatedData.categoryId,
        },
      });

      // 7.2 Eliminar imágenes (solo DB, archivos físicos fuera)
      if (filesToDelete.length > 0) {
        await tx.productImage.deleteMany({
          where: { name: { in: filesToDelete } },
        });
      }

      // 7.3 Crear nuevas imágenes
      if (newImages.length > 0) {
        await tx.productImage.createMany({
          data: newImages.map(img => ({
            name: img.name,
            productId: id,
          })),
        });
      }

    

      // 7.5 Crear nuevas especificaciones
      await tx.productSpecification.deleteMany({
        where: { productId: id },
      });
        await tx.productSpecification.createMany({
          data: specifications.map((spec: { label: string; value: string }) => ({
            name: spec.label,
            value: spec.value,
            productId: id,
          })),
        });

      return product;
    });

    // 8. Eliminar archivos físicamente (fuera de transacción)
    for (const fileName of filesToDelete) {
      await deleteImage(fileName);
    }

    return NextResponse.json({
      message: 'Producto actualizado correctamente',
      product: updatedProduct,
    }, { status: 200 });

  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}


// Eliminar un producto (borrado lógico)
export async function DELETE(request: Request, { params }: Params) {
  try {
    // Verificar autenticación
    const auth = await requireAuth();

    if (!auth.isAutenticated) {
      return auth.response;
    }

    const { id } = await params;

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: {
        id,
      }
    });

    if (!product) {
      return NextResponse.json({
        error: 'El producto no existe',
      }, { status: 404 });
    }

    // Realizar borrado lógico (cambiar estado a DELETED)
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        status: 'DELETED',
      }
    });

    return NextResponse.json({
      message: 'Producto eliminado correctamente',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    
    return NextResponse.json({
      error: 'Error al eliminar el producto',
    }, { status: 500 });
  }
}
