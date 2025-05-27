"use client";

import React, { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useCartActions } from "../hooks/useCartActions";
import { CartDrawer } from "./CartDrawer";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const {  status } = useSession();
  const { pendingCartItem, clearPendingData } = useCartStore();
  const { fetchCart, processPendingCartItem, isAuthenticated } = useCartActions();

  useEffect(() => {
    if (!isAuthenticated) return;
    // Si el usuario está autenticado y hay un producto pendiente, lo procesamos
    if (pendingCartItem) {
      // Procesar el producto pendiente
      processPendingCartItem();
    }
    fetchCart();
    clearPendingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pendingCartItem]);
  // Clear pending cart data when user explicitly logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      // Only clear if we're not on the login page (to preserve redirect info)
      if (!pathname.includes("/auth/login")) {
        clearPendingData();
      }
    }
  }, [status, pathname, clearPendingData]);

  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
};
