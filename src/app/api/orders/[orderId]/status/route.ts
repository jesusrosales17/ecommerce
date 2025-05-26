import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = params;
    const body = await req.json();
    const { status } = body;

    // Validate status using zod
    const OrderStatusSchema = z.enum([
      "PENDING", 
      "PROCESSING", 
      "SHIPPED", 
      "DELIVERED", 
      "CANCELLED"
    ]);
    
    try {
      OrderStatusSchema.parse(status);
    } catch (error) {
      return NextResponse.json(
        { error: "Estado de pedido inválido" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar el estado del pedido" },
      { status: 500 }
    );
  }
}
