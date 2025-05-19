import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  id: string
  name: string
  slug: string
  image?: string
}

export function CategoryCard({ id, name, slug, image }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className="group relative overflow-hidden rounded-lg border hover:border-primary transition-colors">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image ? `/uploads/categories/${image}` : "/images/category-placeholder.png"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 w-full p-3">
          <h3 className="text-sm font-medium text-white">{name}</h3>
        </div>
      </div>
    </Link>
  )
}
