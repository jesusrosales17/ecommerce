import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Check if a product is in favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json({ isFavorite: false });
    }

    // Get product ID from query parameter
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "El ID del producto es requerido" },
        { status: 400 }
      );
    }

    // Check if the product is in favorites
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return NextResponse.json(
      { error: "Error al verificar favorito" },
      { status: 500 }
    );
  }
}
