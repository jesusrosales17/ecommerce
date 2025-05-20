
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
      viewAllLink="/featured"
      viewAllText="Ver todos los productos destacados"
    >
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 overflow-hidden lg:mx-4 lg:max-h-[350px] 2xl:max-h-[380px]">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            salePrice={product.salePrice as number | undefined}
            isOnSale={product.isOnSale}
            category={product.category?.name || "Sin categoria"}
            image={product.images?.[0]?.name}
          />
        ))}
      </div>
    </Section>
  )
}
