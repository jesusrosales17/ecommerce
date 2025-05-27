import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/libs/auth/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await requireAuth(["ADMIN"]);
    if (!session.isAutenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 402 });
    }

    // Await params para asegurar que están disponibles
    const { orderId } = await params;
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
      console.log(error)
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
