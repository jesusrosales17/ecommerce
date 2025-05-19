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
      title="Categorías populares"
      description="Explora nuestras categorías más populares"
      action={
        <Button asChild variant="ghost" size="sm">
          <Link href="/categories" className="flex items-center gap-1">
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            slug={category.slug}
            image={category.image}
          />
        ))}
      </div>
    </Section>
  )
}
