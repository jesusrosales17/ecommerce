import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/features/products/components/ProductCard"
import { Product } from "@/features/products/interfaces/product"



interface FeaturedProductsProps {
  products: Product[]
}

export async function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <Section
      title="Productos destacados"
      description="Nuestros productos más populares elegidos por nuestros clientes"
      viewAllLink="/products"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            salePrice={product.salePrice}
            isOnSale={product.isOnSale}
            image={product.images?.[0]?.name}
            isFeatured={product.isFeatured}
          />
        ))}
      </div>
    </Section>
  )
}
