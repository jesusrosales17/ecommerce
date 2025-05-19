"use client"

import { useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/libs/utils"
import { Button } from "@/components/ui/button"
import { formattedPrice } from "@/utils/price"

interface ProductCardProps {
  id: string
  name: string
  description: string | null
  price: number
  salePrice: number | null
  isOnSale: boolean
  image: string
  className?: string
  isFeatured?: boolean
}

export function ProductCard({
  id,
  name,
  description,
  price,
  salePrice,
  isOnSale,
  image,
  className,
  isFeatured
}: ProductCardProps) {
  const [isPending, startTransition] = useTransition()

  const addToFavorites = () => {
    startTransition(() => {
      // Add to favorites logic will go here
      console.log("Add to favorites:", id)
    })
  }

  return (
    <div className={cn("group overflow-hidden rounded-lg border", className)}>
      <Link href={`/product/${id}`} className="relative block overflow-hidden">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image ? `/uploads/products/${image}` : "/images/product-placeholder.png"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        
        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-white">
            Destacado
          </span>
        )}
        
        {/* Sale badge */}
        {isOnSale && salePrice && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
            {Math.round(((price - salePrice) / price) * 100)}% OFF
          </span>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/product/${id}`}>
              <h3 className="font-medium text-gray-800 line-clamp-1 hover:underline">{name}</h3>
            </Link>
              <div className="mt-1 flex items-center gap-2">
              {isOnSale && salePrice ? (
                <>
                  <span className="font-medium text-primary">{formattedPrice(salePrice)}</span>
                  <span className="text-sm text-gray-400 line-through">{formattedPrice(price)}</span>
                </>
              ) : (
                <span className="font-medium text-primary">{formattedPrice(price)}</span>
              )}
            </div>
          </div>

          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full" 
            onClick={addToFavorites}
            disabled={isPending}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>

        {description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  )
}
