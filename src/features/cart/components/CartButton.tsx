'use client';
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useCartAuth } from '../hooks/useCartAuth'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner';

interface CartButtonProps {
  productId: string;
  quantity?: number;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export const CartButton = ({
  productId,
  quantity = 1,
  variant = 'default',
  size = 'icon',
  showText = false,
  className = ''
}: CartButtonProps) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useCartAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    // Evitar que el evento se propague a elementos padres (como el Link de la tarjeta)
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Save intended product and redirect to login
      addToCart(productId, quantity, false);
      // Use Next-Auth's signIn to redirect to login page
      signIn(undefined, { callbackUrl: window.location.pathname });
    } else {
      // User is authenticated, directly add to cart
      try {
        await addToCart(productId, quantity, true);
        toast.success('Producto agregado al carrito');
      } catch (error) {
        toast.error('Error al agregar al carrito');
      }
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      variant={variant}
      className={`rounded-md hover:-translate-y-0.5 transition-all duration-300 ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {showText && <span className="ml-2">Agregar al carrito</span>}
    </Button>
  )
}
