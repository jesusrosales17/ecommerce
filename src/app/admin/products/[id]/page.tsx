import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/products/interfaces/product";
import { ProductImagesCard } from "@/features/products/components/ProductImagesCard";
import { ProductCategoryCard } from "@/features/products/components/ProductCategoryCard";
import { ProductDatesCard } from "@/features/products/components/ProductDatesCard";
import { ProductGeneralInfoCard } from "@/features/products/components/ProductGeneralInfoCard";
import { ProductTabsContent } from "@/features/products/components/ProductTabsContent";
import { ProductActionsCard } from "@/features/products/components/ProductActionsCard";
import { ProductSummaryCard } from "@/features/products/components/ProductSummaryCard";

interface Props {
  params: Promise<{ id: string }>;
}

const ProductViewPage = async ({ params }: Props) => {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-bold">Error al cargar</h1>
        <p className="text-muted-foreground">
          No fue posible obtener la información del producto.
        </p>
        <Link href="/admin/products">
          <Button variant="secondary">Volver a productos</Button>
        </Link>
      </div>
    );
  }

  const product: Product = await res.json();

  return (
    <div className="space-y-6 pb-8 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Volver a productos
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground">Detalles del producto</p>
        </div>
        <Badge
          variant={product.status === "ACTIVE" ? "default" : "secondary"}
          className="uppercase"
        >
          {product.status === "ACTIVE" ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images & Category & Dates */}
        <div className="space-y-6">
          {/* Images */}
          <ProductImagesCard
            images={product.images}
            productName={product.name}
          />

          {/* Category */}
          <ProductCategoryCard categoryName={product.category?.name} />

          {/* Dates */}
          <ProductDatesCard
            createdAt={product.createdAt}
            updatedAt={product.updatedAt}
          />
        </div>

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info, Price, Stock */}
          <ProductGeneralInfoCard
            price={product.price}
            stock={product.stock}
            isOnSale={product.isOnSale}
            salePrice={product.salePrice}
            isFeatured={product.isFeatured}
            brand={product.brand}
            color={product.color}
          />

          {/* Tabs for Description & Specs */}
          <ProductTabsContent
            description={product.description}
            specifications={product.specifications}
          />

          {/* Actions & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProductActionsCard productId={product.id} />
            <ProductSummaryCard
              id={product.id}
              imagesCount={product.images.length}
              specificationsCount={product.specifications.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
