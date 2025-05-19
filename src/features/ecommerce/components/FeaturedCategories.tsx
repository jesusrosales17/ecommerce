import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section } from "@/components/ui/section"
import { CategoryCard } from "@/features/categories/components/CategoryCard"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

interface FeaturedCategoriesProps {
  categories: Category[]
}

export async function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <Section
      title="Gran variedad de categorías"
      description="Explora entre nuestra gran variedad de categorías"
      viewAllLink="/categories"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* solo 5 */}
        {categories.splice(0, 5).map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image!}
          />
        ))}
      </div>
    </Section>
  )
}
