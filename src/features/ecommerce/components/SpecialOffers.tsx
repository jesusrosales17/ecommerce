import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/features/products/interfaces/product"
import { ProductCard } from "@/features/products/components/ProductCard"

interface SpecialOffersProps {
  products: Product[]
}

export function SpecialOffers({ products }: SpecialOffersProps) {
  // Filtrar solo los productos que están en oferta
  const productsOnSale = products.filter(product => product.isOnSale)

  return (
    <Section
      title="Ofertas Especiales"
      description="Aprovecha nuestras mejores promociones"
      viewAllLink="/ofertas"
      viewAllText="Ver todas las ofertas"
    >

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 overflow-hidden lg:mx-4 lg:max-h-[330px] 2xl:max-h-[380px]">
        {productsOnSale.map((product) => (
         <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            salePrice={product.salePrice as number | undefined}
            isOnSale={product.isOnSale}
            specifications={product.specifications}
            image={product.images?.[0]?.name}
          /> 
        ))}
      </div>
    </Section>
  )
} 