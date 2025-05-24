'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useCartActions } from './useCartActions';

export const useCartAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    cart,
    pendingCartItem, 
    redirectAfterLogin, 
    clearPendingData, 
   
  } = useCartStore();
  const {processPendingCartItem, fetchCart} = useCartActions();

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';


  

  return {
    isAuthenticated,
    isAdmin,
    userId: session?.user?.id,
    status,
  };
};
