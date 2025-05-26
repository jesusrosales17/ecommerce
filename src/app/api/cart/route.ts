import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Get cart items for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

   
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Find the user's cart, or create one if it doesn't exist
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            Product: {
                include: {
                    images: true,
                    category: true,
                }
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    // Calculate the total price for the cart
    const total = cart.items.reduce((sum, item) => {
      const price = item.Product?.isOnSale 
        ? Number(item.Product?.salePrice || 0) 
        : Number(item.Product?.price || 0);
      return sum + (price * item.quantity);
    }, 0);

    return NextResponse.json({
      items: cart.items,
      total
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 }
    );
  }
}

// Clear the entire cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (cart) {
      // Delete all items from the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    return NextResponse.json(
      { error: "Error al vaciar el carrito" },
      { status: 500 }
    );
  }
}
