'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';

export const useCartAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    pendingCartItem, 
    redirectAfterLogin, 
    clearPendingData, 
    processPendingCartItem,
    fetchCart
  } = useCartStore();

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    // If user just became authenticated and there's a pending cart item
    if (isAuthenticated && pendingCartItem) {
      // Process the pending cart item
      processPendingCartItem();
    }

    // If user just became authenticated and there's a redirect path
    if (isAuthenticated && redirectAfterLogin) {
      // Redirect admin users to admin panel
      if (isAdmin) {
        router.push('/admin');
      } 
      // Redirect normal users back to where they were
      else if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      }
      clearPendingData();
    }
  }, [
    isAuthenticated, 
    pendingCartItem, 
    redirectAfterLogin, 
    processPendingCartItem, 
    clearPendingData,
    isAdmin,
    router
  ]);

  // Fetch cart data when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return {
    isAuthenticated,
    isAdmin,
    userId: session?.user?.id,
    status,
  };
};
