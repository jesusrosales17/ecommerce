import { categoryUpdateSchema } from "@/features/categories/schemas/categorySchema";
import { requireAuth } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
    params: Promise< {
        id: string;
    }>
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const auth = await requireAuth();

        // if (!auth.isAutenticated) {
        //     return auth.response;
        // }
        // obtener el id de la categoria
        const {id}  = await params;

        // validar los datos
        const body = await request.json();
        body.id = id;
        
        const {name, status, description} = categoryUpdateSchema.parse(body);

        //  verificar si la categoria existe
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

        // actualizar la categoria en la bd
        const updatedCategory = await prisma.category.update({
            where: {
                id
            }, 
            data: {
                name, 
                status,
                description,
            }
        })

        return NextResponse.json({
            message: "Categoría actualizada correctamente",
            category: updatedCategory,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: error.issues[0].message,
            }, { status: 400 })
        }

        console.log('Error inesperado', error);

        return NextResponse.json(
            { error: "Error al actualizar la categoría" }, { status: 500 })
    }

}
