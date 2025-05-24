'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/features/cart/components/CartProvider';

/**
 * AppProviders - Proporciona los contextos necesarios para la aplicación
 * Use este componente en rutas que necesiten acceso a sesión y carrito
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
};
