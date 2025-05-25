import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/libs/auth/auth-options";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Debe iniciar sesión" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    return NextResponse.json(
      { error: "Error al obtener direcciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Debe iniciar sesión" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isDefault, ...addressData } = body;

    // Si la dirección es marcada como predeterminada, desmarcar las existentes
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Si es la primera dirección del usuario, marcarla como predeterminada
    const addressCount = await prisma.address.count({
      where: {
        userId: session.user.id,
      },
    });

    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        isDefault: isDefault || addressCount === 0, // Primera dirección o explícitamente marcada
        userId: session.user.id,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error al crear dirección:", error);
    return NextResponse.json(
      { error: "Error al crear dirección" },
      { status: 500 }
    );
  }
}
