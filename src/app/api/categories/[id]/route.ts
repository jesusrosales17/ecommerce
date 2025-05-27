import { File } from 'node:buffer'
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
        
        // Cambiar el tipo aquí - usar unknown en lugar de File
        const imageFile = formData.get('image') as unknown;

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
        let imageData = null;
        let finalImageName = category.image || null;

        // Verificar si es un archivo válido
        if (imageFile && typeof imageFile === 'object' && imageFile !== null) {
            // Verificar si tiene las propiedades de un archivo
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const file = imageFile as File;
            if (file.size && file.type && file.name) {
                // Eliminar la imagen antigua si existe
                if (category.image) {
                    try {
                        await deleteImage(category.image, 'categories');
                    } catch (error) {
                        console.error('Error al eliminar la imagen antigua:', error);
                    }
                }
                
                // Convertir File a Buffer y guardar la nueva imagen
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                imageData = await saveImage(buffer, file.name, 'categories');
                finalImageName = imageData.name;
            }
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