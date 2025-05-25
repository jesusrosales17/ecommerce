'use client';

import { useFavoriteStore } from '../store/useFavoriteStore';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FavoriteCard } from './FavoriteCard';

export const FavoritesList = () => {
  const { favorites, isLoading } = useFavoriteStore();
  const { fetchFavorites, removeFromFavorites, isAuthenticated } = useFavoriteActions();

  // Fetch favorites on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-400" />
        <h2 className="text-2xl font-medium text-gray-600">
          Necesitas iniciar sesión para ver tus favoritos
        </h2>
        <Button asChild>
          <Link href="/auth/login">
            Iniciar sesión
          </Link>
        </Button>
      </div>
    );
  }



  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Heart className="w-12 h-12 text-gray-400" />
        <h2 className="text-2xl font-medium text-gray-600">
          No tienes productos favoritos
        </h2>
        <Button asChild>
          <Link href="/products">
            Explorar productos
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {favorites.map((item) => (
        <FavoriteCard 
          key={item.id} 
          item={item} 
          onRemove={removeFromFavorites} 
        />
      ))}
    </div>
  );
};

import { Heart } from 'lucide-react';
