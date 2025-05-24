"use client";

import React, { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useCartAuth } from "../hooks/useCartAuth";
import { useCartActions } from "../hooks/useCartActions";
import { CartDrawer } from "./CartDrawer";
import { usePathname } from "next/navigation";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { status } = useCartAuth();
  const { pendingCartItem, clearPendingData } = useCartStore();
  const { fetchCart, processPendingCartItem} = useCartActions();
  const { isAuthenticated } = useCartAuth();
  // No necesitamos llamar a fetchCart aquí, ya lo hace useCartAuth

  useEffect(() => {
    if (!isAuthenticated) return;
    // Si el usuario está autenticado y hay un producto pendiente, lo procesamos
    if (pendingCartItem) {
      // Procesar el producto pendiente
      processPendingCartItem();
    }
    fetchCart();
    clearPendingData();
  }, [isAuthenticated, pendingCartItem]);

  // Clear pending cart data when user explicitly logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      // Only clear if we're not on the login page (to preserve redirect info)
      if (!pathname.includes("/auth/login")) {
        useCartStore.getState().clearPendingData();
      }
    }
  }, [status, pathname]);

  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
};
