import { getSession } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema para validar la actualización del estado
const updateOrderSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING", 
    "SHIPPED", 
    "DELIVERED", 
    "CANCELLED"
  ]).optional(),
});

// GET para obtener una orden específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = params;

    // Solo los administradores pueden ver cualquier orden
    // Los usuarios normales solo pueden ver sus propias órdenes
    const orderQuery = session.user.role === "ADMIN"
      ? { id }
      : { id, userId: session.user.id };

    const order = await prisma.order.findUnique({
      where: orderQuery,
      include: {
        items: true,
        Address: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json(
      { error: "Error al obtener la orden" },
      { status: 500 }
    );
  }
}

// PATCH para actualizar el estado de la orden
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    // Solo los administradores pueden actualizar el estado de las órdenes
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    
    // Validar el cuerpo de la solicitud
    const validationResult = updateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Buscar la orden
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar el estado
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: body.status as OrderStatus,
      },
      include: {
        items: true,
        Address: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}
