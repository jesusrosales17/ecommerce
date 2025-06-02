import { categoryUpdateSchema } from "@/features/categories/schemas/categorySchema";
import { requireAuth } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { saveImage, deleteImage } from "@/libs/media/image-handler";

interface Params {
    params: Promise<{
        id: string;
    }>
}

// Type guard to check if the value is a Blob-like object
function isBlobLike(value: unknown): value is { arrayBuffer(): Promise<ArrayBuffer> } {
    return value !== null && 
           typeof value === 'object' && 
           'arrayBuffer' in value && 
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           typeof (value as any).arrayBuffer === 'function';
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const auth = await requireAuth();

        if (!auth.isAutenticated) {
            return auth.response;
        }
        
        // obtener el id de la categoria
        const { id } = await params;

        // Parse formData
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string || undefined;
        const status = formData.get('status') as string;
        const imageFile = formData.get('image');

        // Include id in validated data
        const validationData = {
            id,
            name,
            description,
            status,
            image: imageFile
        };
        
        const validatedData = categoryUpdateSchema.parse(validationData);

        // verificar si la categoria existe
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            return NextResponse.json({
                error: "La categoría no existe",
            }, { status: 404 });
        }

        // Procesar la imagen si se subió una nueva
        let finalImageName = category.image || null;

        if (imageFile && isBlobLike(imageFile)) {
            // Eliminar la imagen antigua si existe
            if (category.image) {
                try {
                    await deleteImage(category.image, 'categories');
                } catch (error) {
                    console.error('Error al eliminar la imagen antigua:', error);
                }
            }
            
            // Convertir el archivo a Buffer
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Generar un nombre único para la imagen
            const timestamp = Date.now();
            const fileName = `image_${timestamp}.jpg`;
            
            // Guardar la nueva imagen
            const imageData = await saveImage(buffer, fileName, 'categories');
            finalImageName = imageData.name;
        }

        // actualizar la categoria en la bd
        const updatedCategory = await prisma.category.update({
            where: {
                id
            },
            data: {
                name: validatedData.name,
                status: validatedData.status,
                description: validatedData.description,
                image: finalImageName,
            }
        });

        return NextResponse.json({
            message: "Categoría actualizada correctamente",
            category: updatedCategory,
        }, { status: 200 });
        
    } catch (error) {
        console.log('Error inesperado', error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: error.issues[0].message,
            }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Error al actualizar la categoría" }, 
            { status: 500 }
        );
    }
}

// Eliminar una categoría (borrado lógico)
export async function DELETE(request: Request, { params }: Params) {
    try {
        const auth = await requireAuth();

        if (!auth.isAutenticated) {
            return auth.response;
        }

        // Obtener el id de la categoría
        const { id } = await params;

        // Verificar si la categoría existe
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            return NextResponse.json({
                error: "La categoría no existe",
            }, { status: 404 });
        }

        // Verificar si la categoría ya está eliminada
        if (category.status === 'DELETED') {
            return NextResponse.json({
                error: "La categoría ya está eliminada",
            }, { status: 400 });
        }

        // Verificar si hay productos activos asociados a esta categoría
        const activeProductsCount = await prisma.product.count({
            where: {
                categoryId: id,
                status: {
                    not: 'DELETED'
                }
            }
        });

        if (activeProductsCount > 0) {
            return NextResponse.json({
                error: `No se puede eliminar la categoría porque tiene ${activeProductsCount} producto(s) activo(s) asociado(s). Primero debe eliminar, desactivar o mover los productos a otra categoría.`,
            }, { status: 400 });
        }

        // Actualizar el status de la categoría a DELETED (soft delete)
        const deletedCategory = await prisma.category.update({
            where: {
                id
            },
            data: {
                status: 'DELETED',
            }
        });

        return NextResponse.json({
            message: "Categoría eliminada correctamente",
            category: deletedCategory,
        }, { status: 200 });

    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        
        return NextResponse.json({
            error: 'Error al eliminar la categoría',
        }, { status: 500 });
    }
}