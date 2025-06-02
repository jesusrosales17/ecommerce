import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username?: string;
    image?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username?: string;
      role: string;
      image?: string;  // Añadimos la propiedad image como opcional
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role;
    username?: string;
    image?: string;  // También añadimos image al JWT
  }
}