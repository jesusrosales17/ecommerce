'use client';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import { cn } from '@/libs/utils';

interface FavoriteButtonProps {
  productId: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showFilled?: boolean; // Si se debe mostrar lleno cuando está en favoritos
}

export const FavoriteButton = ({
  productId,
  variant = 'ghost',
  size = 'icon',
  className = '',
  showFilled = true,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toggleFavorite, isProductInFavorites, isLoading } = useFavoriteActions();

  // Check if product is in favorites on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const status = await isProductInFavorites(productId);
      setIsFavorite(status);
    };

    checkFavoriteStatus();
  }, [productId, isProductInFavorites]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    // Prevent event from propagating (e.g., if the button is in a card)
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await toggleFavorite(productId);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      size={size}
      variant={variant}
      disabled={isLoading}
      className={cn(
        'transition-all duration-300 hover:bg-rose-500 hover:text-white rounded-full',
        showFilled && isFavorite && 'text-rose-500 hover:text-rose-600',
        className
      )}
      aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
      title={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart
        className={cn('h-5 w-5', showFilled && isFavorite && 'fill-current')}
      />
    </Button>
  );
};
