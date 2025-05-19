
import { Section } from "@/components/ui/section"
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
      viewAllText="Ver todos los productos destacados"
    >
      <div className="grid md:px-4 rounded-sm overflow-hidden grid-cols-2 md:grid-cols-2  lg:grid-cols-4 lg:gap-6 ">
        {products.map((product) => (
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
