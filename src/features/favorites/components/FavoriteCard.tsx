'use client';

import { formatPrice } from '@/utils/price';
import { X, ChevronRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FavoriteItemWithProduct } from '../interfaces/favoriteStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface FavoriteCardProps {
  item: FavoriteItemWithProduct;
  onRemove: (productId: string) => void;
}

export const FavoriteCard = ({ item, onRemove }: FavoriteCardProps) => {
  const image = item.Product?.images?.find(img => img.isPrincipal) || item.Product?.images?.[0];
  const isOutOfStock = !item.Product?.stock;

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg group">
      {/* Eliminar de favoritos con tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-background/90 rounded-full z-10 hover:bg-destructive hover:text-white transition-colors"
              onClick={() => onRemove(item.productId)}
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

      {/* Imagen del producto con esqueleto de carga */}
      <Link href={`/products/${item.productId}`} className="block relative aspect-square">
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
         
            <Image
              src={`/api/uploads/products/${image?.name}`}
              alt={item.Product?.name || 'Producto'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            />
          
          
          {/* Badge de oferta con transición */}
          {item.Product?.isOnSale && (
            <Badge 
              className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-sm animate-pulse"
              variant="destructive"
            >
              ⚡ Oferta Limitada
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="pt-4 space-y-3">
        <Link href={`/products/${item.productId}`} className="hover:underline">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
            {item.Product?.name}
          </h3>
        </Link>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-xl ${item.Product?.isOnSale ? 'text-red-600' : 'text-foreground'}`}>
              {formatPrice(
                item.Product?.isOnSale 
                  ? Number(item.Product.salePrice) 
                  : Number(item.Product?.price)
              )}
            </span>
            {item.Product?.isOnSale && (
              <span className="text-muted-foreground line-through text-sm">
                {formatPrice(Number(item.Product.price))}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={item.Product?.stock ? 'default' : 'destructive'} 
              className="px-2 py-1 text-sm"
            >
              {item.Product?.stock ? `📦 ${item.Product.stock} en stock` : '😞 Agotado'}
            </Badge>
           
          </div>
        </div>
      </CardContent>
      
      <Separator className="mb-4" />
      
      <CardFooter>
        <Button 
          asChild 
          className="w-full relative overflow-hidden transition-all hover:gap-3 disabled:opacity-50"
          disabled={isOutOfStock}
        >
          <Link href={`/products/${item.productId}`}>
            {isOutOfStock ? (
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Notificar disponibilidad
              </span>
            ) : (
              <>
                <span>Ver producto</span>
                <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-0 duration-1000" />
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// // Esqueleto de carga para mejor experiencia
// export const FavoriteCardSkeleton = () => (
//   <Card className="overflow-hidden">
//     <Skeleton className="aspect-square w-full" />
//     <CardContent className="pt-4 space-y-3">
//       <Skeleton className="h-5 w-3/4" />
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-1/2" />
//         <Skeleton className="h-4 w-1/3" />
//       </div>
//     </CardContent>
//     <CardFooter>
//       <Skeleton className="h-10 w-full" />
//     </CardFooter>
//   </Card>
// );