"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const getSession = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {  return null; }

    return session;
}