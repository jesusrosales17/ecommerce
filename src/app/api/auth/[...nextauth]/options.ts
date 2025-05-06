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
      async authorize(credentials, req) {
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
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || undefined // Convert null to undefined
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log(
        "Session Callback:",
        { session, user, token }
      )
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
        // Asegurándonos de pasar la imagen si existe
        if (user.image) {
          session.user.image = user.image;
        }
      } 
      else if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        // Pasando la imagen del token si existe
        if (token.picture) {
          session.user.image = token.picture as string;
        } else if (token.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role as Role;
        token.id = user.id;
        // Guardando la imagen en el token si existe
        if (user.image) {
          token.image = user.image;
        }
      }
      
      // Para proveedores OAuth como Google, la imagen viene en profile
      if (account?.provider === "google" && profile?.image) {
        token.picture = profile.image;
      }
      
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET
};