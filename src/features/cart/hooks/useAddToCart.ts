import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useCartAuth } from './useCartAuth';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export const useAddToCart = (productId: string, maxStock?: number) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useCartAuth();
  
  // Si no se proporciona, asumimos un stock alto
  const stock = typeof maxStock === 'number' ? maxStock : 999;

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error('No hay suficiente stock disponible');
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      if (!isAuthenticated) {
        // Save product and redirect to login
        addToCart(productId, quantity, false);
        // Use Next-Auth's signIn to redirect to login page
        signIn(undefined, { callbackUrl: window.location.pathname });
      } else {
        // User is authenticated, directly add to cart
        await addToCart(productId, quantity, true);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return {
    quantity,
    isAdding,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
  };
};
