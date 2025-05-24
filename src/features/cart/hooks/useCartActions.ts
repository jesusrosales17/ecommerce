import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';

export const useCartActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    setCart, 
    setTotal, 
    setPendingCartItem, 
    setRedirectAfterLogin,
    pendingCartItem,
    setIsLoading: setStoreLoading
  } = useCartStore();
  // Fetch cart data from API
  const fetchCart = async () => {
    // Evitar múltiples solicitudes simultáneas
    if (isLoading) return { items: [], total: 0 };
    
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
        console.log('fetchCart')
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Evitar caché para esta solicitud
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }

      const data = await response.json();
      setCart(data.items || []);
      setTotal(data.total || 0);
      
      return { items: data.items, total: data.total };
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al cargar el carrito');
      return { items: [], total: 0 };
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number, isAuthenticated: boolean) => {
    // If user is not authenticated, save for later and return
    if (!isAuthenticated) {
      setPendingCartItem({ productId, quantity });
      setRedirectAfterLogin(window.location.pathname);
      return;
    }

    setIsLoading(true);
    setStoreLoading(true);
    
    try {
        console.log('ad to cart')
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }

      // Refresh the cart after adding item
      await fetchCart();
    
      toast.success('Producto agregado al carrito');
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar producto al carrito');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    setStoreLoading(true);
    console.log('remove from cart') 
    try {
      const response = await fetch(`/api/cart/items?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar del carrito');
      }

      // Update the local state
      await fetchCart();
      toast.success('Producto eliminado del carrito');
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar producto del carrito');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      const response = await fetch('/api/cart/items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cantidad');
      }

      // Update the local state
      await fetchCart();
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar cantidad');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al vaciar el carrito');
      }

      setCart([]);
      setTotal(0);
      toast.success('Carrito vaciado correctamente');
      
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error al vaciar el carrito');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Process pending cart item after login
  const processPendingCartItem = async () => {
    if (pendingCartItem) {
      await addToCart(
        pendingCartItem.productId,
        pendingCartItem.quantity,
        true // User is now authenticated
      );
      // Clear the pending item after processing
      setPendingCartItem(null);
    }
  };

  return {
    isLoading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    processPendingCartItem
  };
};
