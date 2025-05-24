'use client';

import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useCartAuth } from '../hooks/useCartAuth';
import { CartDrawer } from './CartDrawer';
import { usePathname } from 'next/navigation';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const pathname = usePathname();
  const { isAuthenticated, status } = useCartAuth();
  const { fetchCart } = useCartStore();
  
  // Fetch cart data when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Clear pending cart data when user explicitly logs out
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Only clear if we're not on the login page (to preserve redirect info)
      if (!pathname.includes('/auth/login')) {
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
