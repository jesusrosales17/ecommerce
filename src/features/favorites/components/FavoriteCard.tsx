import { formatPrice } from "@/utils/price";
import { ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FavoriteItemWithProduct } from "../interfaces/favoriteStore";
import { ClientRemoveButton } from "./ClientRemoveButton";

interface FavoriteCardProps {
  item: FavoriteItemWithProduct;
}

export const FavoriteCard = ({ item }: FavoriteCardProps) => {
  console.log(FavoriteCard);
  const image =
    item.Product?.images?.find((img) => img.isPrincipal) ||
    item.Product?.images?.[0];
  const isOutOfStock = !item.Product?.stock;
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg group">
      {/* Importamos el componente client de eliminar favoritos */}
      <ClientRemoveButton productId={item.productId} />{" "}
      {/* Imagen del producto con esqueleto de carga */}
      <Link
        href={`/products/${item.productId}`}
        className="block relative aspect-square"
      >
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br bg-white rounded-t-lg">
          {image?.name ? (
            <div className="w-full h-full flex items-center justify-center p-2">
              <div className="relative w-full h-full">
                <Image
                  src={`/api/uploads/products/${image.name}`}
                  alt={item.Product?.name || "Producto"}
                  fill
                  className="object-contain hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>Sin imagen</span>
              </div>
            </div>
          )}

          {/* Badge de oferta con transición */}
          {item.Product?.isOnSale && (
            <Badge
              className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-sm animate-pulse"
              variant="destructive"
            >
                en oferta
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
            <span
              className={`font-bold text-xl ${
                item.Product?.isOnSale ? "text-red-600" : "text-foreground"
              }`}
            >
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
              variant={item.Product?.stock ? "default" : "destructive"}
              className="px-2 py-1 text-sm"
            >
              {item.Product?.stock
                ? ` ${item.Product.stock} en stock`
                : " Agotado"}
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
            <span>Ver producto</span>
            <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-0 duration-1000" />
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
