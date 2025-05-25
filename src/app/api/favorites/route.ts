import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Get all favorite items for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Get all favorite items with product details
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        Product: {
          include: {
            images: true
          }
        }
      },
    });

    return NextResponse.json({ items: favorites });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

// Add a product to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "El ID del producto es requerido" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Check if product is already in favorites
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "El producto ya está en favoritos", existingFavorite },
        { status: 200 }
      );
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        Product: {
          include: {
            images: true
          }
        }
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    return NextResponse.json(
      { error: "Error al agregar a favoritos" },
      { status: 500 }
    );
  }
}

// Delete a favorite
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
    }

    // Get product ID from query parameter
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "El ID del producto es requerido" },
        { status: 400 }
      );
    }

    // Find and delete the favorite
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorito no encontrado" },
        { status: 404 }
      );
    }

    // Delete the favorite
    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return NextResponse.json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    return NextResponse.json(
      { error: "Error al eliminar de favoritos" },
      { status: 500 }
    );
  }
}
