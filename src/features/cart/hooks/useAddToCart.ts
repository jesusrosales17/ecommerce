import { useState } from 'react';
import { useCartActions } from './useCartActions';
import { toast } from 'sonner';

export const useAddToCart = (productId: string, maxStock?: number) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCartActions();
  
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
      // La lógica de autenticación está ahora dentro de useCartActions
      await addToCart(productId, quantity);
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
