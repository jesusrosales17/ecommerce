import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await requireAuth(["ADMIN", "USER"]);

    if (!session.isAutenticated || !session.user) {
      return session.response; 
    }

    const address = await prisma.address.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error al obtener dirección:", error);
    return NextResponse.json(
      { error: "Error al obtener dirección" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await requireAuth(["ADMIN", "USER"]);

    if (!session.isAutenticated || !session.user) {
      return session.response;
    }

    // Verificar que la dirección pertenezca al usuario
    const existingAddress = await prisma.address.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
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

    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        ...addressData,
        isDefault: isDefault ?? existingAddress.isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    return NextResponse.json(
      { error: "Error al actualizar dirección" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const session = await requireAuth(["ADMIN", "USER"]);

    if (!session.isAutenticated || !session.user) {
      return session.response;
    }

    // Verificar que la dirección pertenezca al usuario
    const address = await prisma.address.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: {
        id,
      },
    });

    // Si era la dirección predeterminada, establecer otra como predeterminada
    if (address.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: {
          userId: session.user.id,
        },
      });

      if (anotherAddress) {
        await prisma.address.update({
          where: {
            id: anotherAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    return NextResponse.json(
      { error: "Error al eliminar dirección" },
      { status: 500 }
    );
  }
}
