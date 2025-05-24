import { create } from "zustand";
import { CartStore } from "../interfaces/cartStore";
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
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
      setPendingCartItem: (item) => {
        set({ pendingCartItem: item });
      },
      setRedirectAfterLogin: (path) => {
        set({ redirectAfterLogin: path });
      },
      clearPendingData: () => {
        set({ 
          pendingCartItem: null, 
          redirectAfterLogin: null 
        });
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
