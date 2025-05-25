import { useState } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useFavoriteActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    setFavorites, 
    setIsLoading: setStoreLoading,
    addToFavoriteLocally,
    removeFromFavoriteLocally
  } = useFavoriteStore();
  
  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';

  // Fetch favorites data from API
  const fetchFavorites = async () => {
    if (isLoading) return { items: [] };
    if (!isAuthenticated) return { items: [] };
    
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Error al obtener favoritos');
      }

      const data = await response.json();
      setFavorites(data.items || []);
      
      return { items: data.items };
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Error al cargar favoritos');
      return { items: [] };
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Toggle favorite status (add or remove)
  const toggleFavorite = async (productId: string) => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Redirect to login page
      signIn(undefined, { callbackUrl: window.location.pathname });
      return;
    }

    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      // First, check if item is already in favorites
      const isFavorite = await isProductInFavorites(productId);
      
      if (isFavorite) {
        // If it's already a favorite, remove it
        return await removeFromFavorites(productId);
      } else {
        // If it's not a favorite, add it
        return await addToFavorites(productId);
      }
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Check if a product is in favorites
  const isProductInFavorites = async (productId: string): Promise<boolean> => {
    const { favorites } = useFavoriteStore.getState();
    
    // If we have favorites in the store, check there first
    if (favorites && favorites.length > 0) {
      return favorites.some(item => item.productId === productId);
    }
    
    // Otherwise, fetch from API
    if (!isAuthenticated) return false;
    
    try {
      const response = await fetch(`/api/favorites/check?productId=${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar favorito');
      }

      const data = await response.json();
      return data.isFavorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  // Add to favorites
  const addToFavorites = async (productId: string) => {
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar a favoritos');
      }

      const favoriteItem = await response.json();
      
      // Actualización optimista en UI
      addToFavoriteLocally(favoriteItem);
      
      toast.success('Producto agregado a favoritos');
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Error al agregar a favoritos');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (productId: string) => {
    setIsLoading(true);
    setStoreLoading(true);
    
    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos');
      }

      // Actualización optimista en UI
      removeFromFavoriteLocally(productId);
      
      toast.success('Producto eliminado de favoritos');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Error al eliminar de favoritos');
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    isAdmin,
    status,
    fetchFavorites,
    toggleFavorite,
    isProductInFavorites,
    addToFavorites,
    removeFromFavorites
  };
};
