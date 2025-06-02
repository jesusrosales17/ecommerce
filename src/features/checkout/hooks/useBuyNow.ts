"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export const useBuyNow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const buyNow = async (productId: string, quantity: number = 1) => {
    // Check if user is authenticated
    if (!session?.user) {
      toast.error("Debes iniciar sesión para comprar");
      signIn(undefined, { 
        callbackUrl: `${window.location.pathname}?buyNow=${productId}&quantity=${quantity}` 
      });
      return;
    }

    try {
      setIsLoading(true);

      // First, check if user has addresses
      const addressResponse = await fetch('/api/addresses');
      if (!addressResponse.ok) {
        throw new Error('Error al obtener direcciones');
      }

      const addresses = await addressResponse.json();
      
      if (!addresses || addresses.length === 0) {
        toast.error("Necesitas agregar una dirección de envío primero");
        router.push('/addresses?redirectTo=buyNow');
        return;
      }

      // Use default address or first available
      const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0];

      // Create buy now checkout session
      const response = await fetch("/api/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          productId, 
          quantity,
          addressId: defaultAddress.id 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar la compra");
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        router.push(url);
      } else {
        throw new Error("No se pudo generar la URL de pago");
      }
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Ocurrió un error al procesar tu compra. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const buyNowWithAddressSelection = async (productId: string, quantity: number = 1) => {
    // Check if user is authenticated
    if (!session?.user) {
      toast.error("Debes iniciar sesión para comprar");
      signIn(undefined, { 
        callbackUrl: `${window.location.pathname}?buyNow=${productId}&quantity=${quantity}` 
      });
      return;
    }

    // Redirect to a simplified checkout page for single product
    router.push(`/buy-now/${productId}?quantity=${quantity}`);
  };

  return {
    isLoading,
    buyNow,
    buyNowWithAddressSelection,
  };
};
