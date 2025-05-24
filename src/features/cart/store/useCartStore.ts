import { create } from "zustand";
import { CartStore, CartItemWithProduct, PendingCartItem } from "../interfaces/cartStore";
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      cart: [],
      total: 0,
      isLoading: false,
      isCartOpen: false,
      pendingCartItem: null,
      redirectAfterLogin: null,

      // Basic state setters
      setCart: (cart) => {
        set({ cart });
      },
      setTotal: (total) => {
        set({ total });
      },
      setIsLoading: (isLoading) => {
        set({ isLoading });
      },
      setIsCartOpen: (isOpen) => {
        set({ isCartOpen: isOpen });
      },

      // Authentication-related actions
      setPendingCartItem: (item: PendingCartItem | null) => {
        set({ pendingCartItem: item });
      },
      setRedirectAfterLogin: (path: string | null) => {
        set({ redirectAfterLogin: path });
      },
      clearPendingData: () => {
        set({ 
          pendingCartItem: null, 
          redirectAfterLogin: null 
        });
      },

      // Cart operations
      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Error al obtener el carrito');
          }

          const data = await response.json();
          set({
            cart: data.items || [],
            total: data.total || 0,
          });
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, quantity, isAuthenticated) => {
        // If user is not authenticated, save for later and return
        if (!isAuthenticated) {
          set({ 
            pendingCartItem: { productId, quantity },
            redirectAfterLogin: window.location.pathname
          });
          return;
        }

        set({ isLoading: true });
        try {
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
          await get().fetchCart();
          
          // Open cart drawer to show the added item
          set({ isCartOpen: true });
        } catch (error) {
          console.error('Error adding to cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/cart/items?productId=${productId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Error al eliminar del carrito');
          }

          // Update the local state
          await get().fetchCart();
        } catch (error) {
          console.error('Error removing from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true });
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
          await get().fetchCart();
        } catch (error) {
          console.error('Error updating quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Error al vaciar el carrito');
          }

          set({
            cart: [],
            total: 0,
          });
        } catch (error) {
          console.error('Error clearing cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      processPendingCartItem: async () => {
        const { pendingCartItem } = get();
        if (pendingCartItem) {
          await get().addToCart(
            pendingCartItem.productId,
            pendingCartItem.quantity,
            true // User is now authenticated
          );
          // Clear the pending item after processing
          set({ pendingCartItem: null });
        }
      }
    }),
    {
      name: 'cart-storage',
      // Only persist these specific fields
      partialize: (state) => ({
        pendingCartItem: state.pendingCartItem,
        redirectAfterLogin: state.redirectAfterLogin,
      }),
    }
  )
);
