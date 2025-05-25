'use client';

import { Button } from '@/components/ui/button';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FavoriteRemoveButtonProps {
  productId: string;
  className?: string;
}

export const FavoriteRemoveButton = ({ productId, className = '' }: FavoriteRemoveButtonProps) => {
  const { removeFromFavorites } = useFavoriteActions();
  
  const handleRemove = () => {
    removeFromFavorites(productId);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 bg-background/90 rounded-full z-10 hover:bg-destructive hover:text-white transition-colors ${className}`}
            onClick={handleRemove}
            aria-label="Eliminar de favoritos"
          >
            <X className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Eliminar de favoritos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
