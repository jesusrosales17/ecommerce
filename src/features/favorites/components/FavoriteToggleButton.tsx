'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import { useRouter } from 'next/navigation';

interface FavoriteToggleButtonProps {
  showCount?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export const FavoriteToggleButton = ({
  showCount = true,
  variant = 'ghost'
}: FavoriteToggleButtonProps) => {
  const router = useRouter();
  const { favorites } = useFavoriteStore();
  const { isAuthenticated } = useFavoriteActions();
  
  // Calculate total items in favorites
  const itemCount = favorites?.length || 0;

  const handleToggleFavorites = () => {
    if (isAuthenticated) {
      // Navigate to favorites page
      router.push('/favorites');
    } else {
      // If user is not authenticated, redirect to login
      const { signIn } = require('next-auth/react');
      signIn(undefined, { callbackUrl: '/favorites' });
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleToggleFavorites}
        size="icon"
        variant={variant}
        className="rounded-md hover:-translate-y-0.5 transition-all duration-300"
      >
        <Heart className="h-4 w-4" />
      </Button>
      
      {showCount && itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full"
        >
          {itemCount}
        </Badge>
      )}
    </div>
  );
};
