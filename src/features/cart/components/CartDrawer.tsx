import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { useCartAuth } from '../hooks/useCartAuth';
import { useCartActions } from '../hooks/useCartActions';
import { Trash2, X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatPrice } from '@/utils/price';
import Link from 'next/link';

export const CartDrawer = () => {
  const { 
    cart, 
    total, 
    isCartOpen, 
    setIsCartOpen, 
    isLoading,
  } = useCartStore();
  
  const { isAuthenticated } = useCartAuth();
  const { removeFromCart, updateQuantity } = useCartActions();

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(productId, newQuantity);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            Carrito de compras
          </SheetTitle> 
          <SheetDescription>
            {cart.length === 0 
              ? 'Tu carrito está vacío.' 
              : `Tienes ${cart.length} productos en tu carrito.`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 m-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="flex border-b pb-4 relative"
            >
              {/* Product Image */}
              <div className="h-20 w-20 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {item.Product?.image ? (
                  <Image 
                    src={`/api/uploads/products/${item.Product.image}`} 
                    alt={item.Product?.name || 'Producto'} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500 text-xs">Sin imagen</span>
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-sm line-clamp-2 mr-3">
                  {item.Product?.name || 'Producto'}
                </h4>
                
                <div className="flex justify-between items-center mt-2">
                  {/* Price */}
                  <div>
                    <span className="text-sm font-medium">
                      {item.Product?.isOnSale 
                        ? formatPrice(Number(item.Product?.salePrice)) 
                        : formatPrice(Number(item.Product?.price))
                      }
                    </span>
                    {item.Product?.isOnSale && (
                      <span className="text-xs text-gray-500 line-through ml-2">
                        {formatPrice(Number(item.Product?.price))}
                      </span>
                    )}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      disabled={isLoading}
                      onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      disabled={isLoading}
                      onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-0 right-0 h-7 w-7 text-gray-500 hover:text-rose-600"
                onClick={() => removeFromCart(item.productId)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {/* Cart Total */}
        {cart.length > 0 && (
          <div className="py-4 m-4">
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-lg">{formatPrice(total)}</span>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button className="w-full" asChild>
                <Link href="/checkout">
            Comprar
                </Link>
              </Button>
              
        
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
