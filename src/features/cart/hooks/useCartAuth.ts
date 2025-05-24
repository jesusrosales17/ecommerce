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
        pendingCartItem,
        redirectAfterLogin,
        clearPendingData
    } = useCartStore();

    const { fetchCart, processPendingCartItem } = useCartActions();

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
    // Solo se ejecuta cuando el estado de autenticación cambia a true
    useEffect(() => {
        if (status === 'authenticated') {
            // Si el usuario está autenticado, obtenemos el carrito
            fetchCart();
        }
    

    }, [status]); // Añadimos status para detectar cambios en el estado de autenticación
console.log(status)
    return {
        isAuthenticated,
        isAdmin,
        userId: session?.user?.id,
        status,
    };
};