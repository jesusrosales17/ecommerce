import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { z } from "zod";
import { requireAuth } from "@/libs/auth/auth";

// Get all orders
export async function GET() {
  try {
    const session = await requireAuth(["ADMIN"]);
    if (!session || !session.isAutenticated || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Address: true,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Update order status
export async function PATCH(req: Request) {
  try {
    const session = await requireAuth(["ADMIN"]);
    if (!session || !session.isAutenticated || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    const OrderStatusSchema = z.enum([
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ]);

    // Validate the status
    try {
      OrderStatusSchema.parse(status);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
