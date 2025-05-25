'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Badge } from '@/components/ui/badge';
import { useCartActions } from '../hooks/useCartActions';
import { useEffect } from 'react';

interface CartToggleButtonProps {
  showCount?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export const CartToggleButton = ({
  showCount = true,
  variant = 'ghost'
}: CartToggleButtonProps) => {
  const { cart, isCartOpen, setIsCartOpen } = useCartStore();
  const { isAuthenticated } = useCartActions();

  // Calculate total items in cart
  const itemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleToggleCart = () => {
      // Toggle cart drawer for authenticated users
      setIsCartOpen(!isCartOpen);
    
  };

 

  return (
    <div className="relative">
      <Button
        onClick={handleToggleCart}
        size="icon"
        variant={variant}
        className="rounded-md hover:-translate-y-0.5 transition-all duration-300"
      >
        <ShoppingCart className="h-4 w-4" />
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
