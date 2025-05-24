import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

// Validate the cart item data
const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = cartItemSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: validatedData.productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity if item already exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + validatedData.quantity },
        include: { Product: true },
      });
    } else {
      // Create new item if it doesn't exist
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
        include: { Product: true },
      });
    }

    return NextResponse.json({
      message: "Producto agregado al carrito",
      cartItem,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error al agregar producto al carrito:", error);
    return NextResponse.json(
      { error: "Error al agregar producto al carrito" },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = cartItemSchema.parse(body);

    // Get the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
    }

    // Find the cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: validatedData.productId,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Producto no encontrado en el carrito" }, { status: 404 });
    }

    // Update the item quantity
    const cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: validatedData.quantity },
      include: { Product: true },
    });

    return NextResponse.json({
      message: "Cantidad actualizada",
      cartItem,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error al actualizar cantidad:", error);
    return NextResponse.json(
      { error: "Error al actualizar cantidad" },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Get the product ID from the URL or query params
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "ID del producto requerido" }, { status: 400 });
    }

    // Get the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
    }

    // Find and delete the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Producto no encontrado en el carrito" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto del carrito" },
      { status: 500 }
    );
  }
}
