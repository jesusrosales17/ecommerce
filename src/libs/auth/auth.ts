"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const getSession = async () => {
    const session = await getServerSession(authOptions);
    if (!session) { return null; }

    return session;
}

export const requireAuth = async (roles = ['ADMIN']) => {
    const session = await getSession();

    if (!session) {
        return {
            isAutenticated: false,
            response: NextResponse.json(
                { error: "No estás autenticado" }, {
                status: 401,
            }),
        }
    }

    if (!roles.includes(session.user.role)) {
        return {
            isAutenticated: false,
            response: NextResponse.json(
                { error: "No tienes permisos para acceder a esta ruta" }, {
                status: 403,
            }),
        }
    }


    return {
        isAutenticated: true,
        user: session.user,
        response: NextResponse.json(
            { message: "Autenticado" }, {
            status: 200,
        }),
    }
}