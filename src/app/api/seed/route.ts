import prisma from "@/libs/prisma";
import { hash } from "bcrypt";

export async function GET(request: Request) { 
  try {
    // Crear usuario administrador
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {},
      create: {
        name: "Jesus Rosales Castillo",
        email: "jesusrosales07537@gmail.com",
        password: await hash("123456", 10),
        role: "ADMIN",
        emailVerified: new Date(),
        username: "admin",
      },
    });

    return new Response(JSON.stringify({
      message: "Usuario administrador creado correctamente",
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
    return new Response(JSON.stringify({ 
      error: "Error al crear el usuario administrador",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}