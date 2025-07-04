import prisma from "@/libs/prisma";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("El corre y contraseña son requeridos");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("El usuario no existe o la contraseña es incorrecta");
        }

        // Verificar la contraseña con bcrypt
        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("la contraseña es incorrecta");
        }        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username || undefined, // Convert null to undefined
          role: user.role,
          image: user.image || undefined // Convert null to undefined
        };
      }
    })
  ],  callbacks: {
    async session({ session, user, token, trigger, newSession }) {
      // Manejar actualizaciones de sesión
      if (trigger === "update" && newSession) {
        session.user.name = newSession.user?.name || session.user.name;
        session.user.username = newSession.user?.username || session.user.username;
      }
     
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.username = user.username;
        // Asegurándonos de pasar la imagen si existe
        if (user.image) {
          session.user.image = user.image;
        }
      } 
      else if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        // Pasando la imagen del token si existe
        if (token.picture) {
          session.user.image = token.picture as string;
        } else if (token.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    },    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        token.role = user.role as Role;
        token.id = user.id;
        token.username = user.username;
        // Guardando la imagen en el token si existe
        if (user.image) {
          token.image = user.image;
        }
      }
      
      // Manejar actualizaciones del token
      if (trigger === "update" && session) {
        token.name = session.user?.name || token.name;
        token.username = session.user?.username || token.username;
      }
      
      // Para proveedores OAuth como Google, la imagen viene en profile
      if (account?.provider === "google" && profile?.image) {
        token.picture = profile.image;
      }
      
      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET
};