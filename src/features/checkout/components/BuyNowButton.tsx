"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/features/checkout/hooks/useBuyNow";

interface BuyNowButtonProps {
  productId: string;
  maxStock?: number;
  className?: string;
  showQuantitySelector?: boolean;
}

export const BuyNowButton = ({ 
  productId, 
  maxStock = 99, 
  className,
  showQuantitySelector = true 
}: BuyNowButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const { isLoading, buyNow } = useBuyNow();

  const incrementQuantity = () => {
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBuyNow = () => {
    buyNow(productId, quantity);
  };

  if (showQuantitySelector) {
    return (
      <div className="space-y-3 flex-1">
        {/* Quantity Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">Cantidad:</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              disabled={quantity >= maxStock}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Buy Now Button */}
        <Button
          onClick={handleBuyNow}
          disabled={isLoading}
          className={className}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Comprar ahora
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleBuyNow}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Procesando...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar ahora
        </>
      )}
    </Button>
  );
};
