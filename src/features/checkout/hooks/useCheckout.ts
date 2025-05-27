"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createCheckoutSession = async (addressId: string) => {
    if (!addressId) {
      toast.error("Selecciona una dirección de envío para continuar");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar el pago");
      }

      const { url } = await response.json();

      if (url) {
        // !TODO: verificar si getStripe es necesario aquí
        // const stripe = await getStripe();
        // Redirect to Stripe Checkout
        router.push(url);
      } else {
        throw new Error("No se pudo generar la URL de pago");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Ocurrió un error al procesar tu pago. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCheckoutSession,
  };
};
