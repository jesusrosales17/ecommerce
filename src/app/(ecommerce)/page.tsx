
import { HeroCarousel } from "@/features/ecommerce/components/HeroCarousel"
import { FeaturedCategories } from "@/features/ecommerce/components/FeaturedCategories"
import { FeaturedProducts } from "@/features/ecommerce/components/FeaturedProducts"

export default async function HomePage() {
  // Fetch categories
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
    method: "GET",
    cache: "no-store",
  });
  
  const categories = (await categoriesRes.json().catch(() => [])) || [];

  // Fetch featured products
  const productsRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products?featured=true`, {
    method: "GET",
    cache: "no-store",
  });
  
  const products = (await productsRes.json().catch(() => [])) || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Carousel */}
      <HeroCarousel />
      
      <div className="space-y-16 mt-16">
        {/* Featured Categories */}
        <FeaturedCategories categories={categories.slice(0, 6)} />
        
        {/* Featured Products */}
        <FeaturedProducts products={products.slice(0, 8)} />
      </div>
    </main>
  );
}
