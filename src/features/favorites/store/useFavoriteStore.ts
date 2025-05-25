import { create } from "zustand";
import { FavoriteStore } from "../interfaces/favoriteStore";
import { persist } from 'zustand/middleware';

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set) => ({
      // Estado
      favorites: null,
      isLoading: false,
      isFavoritesOpen: false,

      // Setters básicos
      setFavorites: (favorites) => {
        set({ favorites });
      },
      setIsLoading: (isLoading) => {
        set({ isLoading });
      },
      setIsFavoritesOpen: (isOpen) => {
        set({ isFavoritesOpen: isOpen });
      },

      // Actualizaciones locales optimistas
      addToFavoriteLocally: (favorite) => {
        set((state) => ({
          favorites: state.favorites ? [...state.favorites, favorite] : [favorite]
        }));
      },
      removeFromFavoriteLocally: (productId) => {
        set((state) => ({
          favorites: state.favorites 
            ? state.favorites.filter(item => item.productId !== productId) 
            : null
        }));
      },
    }),
    {
      name: 'favorite-storage',
      // No persistimos nada, ya que los favoritos deben estar asociados al usuario
      // y se recuperarán de la base de datos
    }
  )
);
