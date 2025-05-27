import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

// Get a specific order by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await requireAuth(["USER", "ADMIN"]);
    if (!session || !session.isAutenticated || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    // For admins, allow accessing any order
    // For regular users, only allow accessing their own orders
    const where = session.user.role !== "ADMIN" 
      ? { id: orderId, userId: session.user.id }
      : { id: orderId };

    const order = await prisma.order.findUnique({
      where,
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
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
