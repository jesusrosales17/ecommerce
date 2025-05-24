"use client";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAddToCart } from '../hooks/useAddToCart';

interface AddToCartProps {
  productId: string;
  stock?: number;
  className?: string;
}

export const AddToCartButton = ({
  productId,
  stock = 999,
  className = '',
}: AddToCartProps) => {
  const {
    quantity,
    isAdding,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart
  } = useAddToCart(productId, stock);

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrementQuantity}
          disabled={isAdding || stock === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-10 text-center font-medium">
          {quantity}
        </span>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={incrementQuantity}
          disabled={isAdding || quantity >= stock || stock === 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        onClick={handleAddToCart}
        className="w-full"
        disabled={isAdding || stock === 0}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {stock === 0 
          ? 'Sin stock' 
          : isAdding 
            ? 'Agregando...' 
            : 'Agregar al carrito'
        }
      </Button>
    </div>
  );
};
