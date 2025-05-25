'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FavoriteCard } from './FavoriteCard';



export const FavoritesList = () => {
  const {favorites} = useFavoriteStore();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h1 className="text-2xl font-medium text-gray-600">
          No tienes favoritos
        </h1>
        <Button asChild>
          <Link href="/products">Ver productos</Link>
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
        />
      ))}
    </div>
  );
};

import { Heart } from 'lucide-react';import { useFavoriteStore } from '../store/useFavoriteStore';

