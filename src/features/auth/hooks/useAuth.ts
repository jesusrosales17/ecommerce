"use client";

import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginFormValues } from "../schemas/loginSchema";
import { NotificationAdapter } from "@/libs/adapters/notificationAdapter";
import { sonnerNotificationAdapter } from "@/libs/adapters/sonnerAdapter";
import { useCartStore } from "@/features/cart/store/useCartStore";

// Hook de autenticación que utiliza el adaptador de notificaciones
export const useAuth = (notificationProvider: NotificationAdapter = sonnerNotificationAdapter) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {redirectAfterLogin} = useCartStore();

  const login = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        const errorMessage = "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
        setError(errorMessage);
        notificationProvider.error(errorMessage);
        return false;
      }

      if (response?.ok) {
        notificationProvider.success("Inicio de sesión exitoso");
        
        // Obtener la sesión después de iniciar sesión
        const session = await getSession();
        
      
        // Redireccionar según el rol
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
        router.push(redirectAfterLogin || "/");
        }
        
        router.refresh();
        return true;
      }

      return false;
    } catch (error) {
      const errorMessage = "Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo.";
      setError(errorMessage);
      notificationProvider.error(errorMessage);
      console.error("Error de inicio de sesión:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      notificationProvider.success("Sesión cerrada correctamente");
      router.push("/login");
      router.refresh();
      return true;
    } catch (error) {
      const errorMessage = "Ocurrió un error al cerrar sesión";
      notificationProvider.error(errorMessage);
      console.error("Error al cerrar sesión:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
};