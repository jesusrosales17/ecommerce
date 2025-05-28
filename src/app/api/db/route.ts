// funcion para verificar estado de la bd

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Verificar la conexión a la base de datos
    await prisma.$connect();
    
    // Obtener información de las tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    return NextResponse.json({
      status: "success",
      message: "Conexión a la base de datos establecida correctamente",
      tables: tables
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al conectar con la base de datos",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


