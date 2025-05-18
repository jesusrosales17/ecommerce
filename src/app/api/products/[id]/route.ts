import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/libs/prisma';
import { requireAuth } from '@/libs/auth/auth';
import { productFormSchema } from '@/features/products/schemas/productFormSchema';
import { processMultipleImages, deleteImage } from '@/libs/media/image-handler';
import { extractSpecificationsFromFormData } from '@/features/products/schemas/productSpecificationSchema';

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

// Actualizar un producto
export async function PUT(request: Request, { params }: Params) {
  try {
    // Verificar autenticación
    const auth = await requireAuth();

    if (!auth.isAutenticated) {
      return auth.response;
    }

    const { id } = await params;

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        specifications: true,
      }
    });

    if (!existingProduct) {
      return NextResponse.json({
        error: 'El producto no existe',
      }, { status: 404 });
    }

    // Obtener los datos del formulario
    const formData = await request.formData();

    const generalInformation = JSON.parse( formData.get('general')?.toString() || '{}');
    
    // return NextResponsle.json(formData);
    // Validar los datos básicos del producto
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

    // Verificar si hay imágenes a eliminar
    const imagesToDeleteValue = formData.get('imagesToDelete');
    const imagesToDelete = imagesToDeleteValue ? JSON.parse(imagesToDeleteValue.toString()) : [];
    
   
    // Eliminar las imágenes marcadas para ser eliminadas
    if (imagesToDelete.length > 0) {
      // Eliminar de la base de datos
      await prisma.productImage.deleteMany({
        where: {
          name: {
            in: imagesToDelete
          }
        }
      });
      
      // Eliminar archivos físicos - aquí asumimos que tenemos acceso al nombre del archivo
      // Esto requeriría obtener los nombres de archivo antes de eliminar los registros
      const filesToDelete = existingProduct.images
        .filter(img => imagesToDelete.includes(img.name))
        .map(img => img.name);


      for (const fileName of filesToDelete) {
        await deleteImage(fileName);
      }
    }
    
    console.log(formData)
    // Procesar nuevas imágenes
    const newImages = await processMultipleImages(formData, 'images', 'products');
    
    // Extraer especificaciones
    const specifications = extractSpecificationsFromFormData(formData);
    
    // IDs de especificaciones a mantener
    const specsToKeep = formData.getAll('keepSpecification').map(spec => spec.toString());
    
    // Actualizar el producto
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Actualizar producto principal
      const product = await tx.product.update({
        where: {
          id,
        },
        data: {
          name: validatedData.name,
          description: formData.get('description')?.toString(),
          price: validatedData.price,
          stock: validatedData.stock ?? existingProduct.stock,
          isOnSale: validatedData.isOnSale,
          salePrice: validatedData.salePrice,
          isFeatured: validatedData.isFeatured,
          status: validatedData.status,
          categoryId: validatedData.categoryId,
        },
        include: {
          images: true,
          specifications: true,
        }
      });

      // 2. Eliminar especificaciones que no se mantienen
      if (specsToKeep.length > 0) {
        await tx.productSpecification.deleteMany({
          where: {
            productId: id,
            id: {
              notIn: specsToKeep
            }
          }
        });
      } else {
        // Si no hay specs para mantener, eliminar todas
        await tx.productSpecification.deleteMany({
          where: {
            productId: id,
          }
        });
      }

      // 3. Crear nuevas especificaciones
      if (specifications.length > 0) {
        await tx.productSpecification.createMany({
          data: specifications.map(spec => ({
            name: spec.name,
            value: spec.value,
            productId: id,
          }))
        });
      }

      // 4. Crear nuevas imágenes
      if (newImages.length > 0) {
        await tx.productImage.createMany({
          data: newImages.map(img => ({
            name: img.name,
            productId: id,
          }))
        });
      }

      return product;
    });

    return NextResponse.json({
      message: 'Producto actualizado correctamente',
      product: updatedProduct,
    }, { status: 200 });

  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.issues[0].message,
      }, { status: 400 });
    }


    return NextResponse.json({
      error: 'Error al actualizar el producto',
    }, { status: 500 });
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
