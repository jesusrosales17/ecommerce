import { requireAuth } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await requireAuth();
        if (!session.isAutenticated || !session.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // For admins, get all orders
        // For regular users, only get their own orders
        const where = session.user.role !== "ADMIN" 
            ? { userId: session.user.id }
            : {};
        
        // Find orders with appropriate filters
        const orders = await prisma.order.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                User: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        Product: {
                            select: {
                                name: true,
                                images: {
                                    where: {
                                        isPrincipal: true,
                                    },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                Address: true,
            },
        });

        return NextResponse.json(orders, {status: 200});
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return NextResponse.json(
            { error: "Error al obtener los pedidos" },
            { status: 500 }
        );
    }
}