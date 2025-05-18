import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarIcon,
  CircleDollarSign,
  Delete,
  Edit,
  Package,
  Tag,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/products/interfaces/product";
import { formattedPrice } from "@/utils/price";
import { formatRelativeTime } from "@/utils/date";



interface Props {
  params: {
    id: string;
  };
}

const ProductViewPage = async ({ params }: Props) => {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">
          No se pudo cargar la información del producto
        </p>
      </div>
    );
  }

  const product: Product = await res.json();

 

  // Función para formatear la fecha en "hace X tiempo"


  const hasImages = product.images && product.images.length > 0;
  const hasSpecifications =
    product.specifications && product.specifications.length > 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Cabecera con botón de regreso */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a productos
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            Información detallada del producto
          </p>
        </div>
        <Badge
          variant={product.status === "ACTIVE" ? "default" : "secondary"}
          className="uppercase"
        >
          {product.status === "ACTIVE" ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda: Imágenes */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Imágenes del producto</h3>
              {hasImages ? (
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-md overflow-hidden border"
                    >
                      <img
                        src={`/api/uploads/products/${image.name}`}
                        alt={`Imagen de ${product.name}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-6 flex flex-col items-center justify-center bg-muted/30 text-center">
                  <p className="text-muted-foreground">
                    Este producto no tiene imágenes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categoría */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="font-semibold">Categoría</h3>
                </div>
                {product.category ? (
                  <Badge variant="outline">{product.category.name}</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Sin categoría
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-semibold">Fechas</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creado:</span>
                  <span className="font-medium">
                    {formatRelativeTime(product.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Última actualización:
                  </span>
                  <span className="font-medium">
                    {formatRelativeTime(product.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna central: Información general */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Información general</h3>

              <div className="space-y-4">
                {/* Precio */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CircleDollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Precio:</span>
                  </div>
                  <div className="font-medium">
                    {product.isOnSale && product.salePrice ? (
                      <div>
                        <span className="line-through text-gray-500 text-sm mr-2">
                          {formattedPrice(product.price)}
                        </span>
                        <span className="font-bold text-green-600">
                          {formattedPrice(product.salePrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">
                        {formattedPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Stock:</span>
                  </div>
                  <span
                    className={`font-medium ${
                      product.stock <= 5 ? "text-red-500" : ""
                    }`}
                  >
                    {product.stock} unidades
                  </span>
                </div>

                {/* Destacado */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Destacado:</span>
                  <span className="font-medium">
                    {product.isFeatured ? "Sí" : "No"}
                  </span>
                </div>

                {/* En oferta */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">En oferta:</span>
                  <span className="font-medium">
                    {product.isOnSale ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Descripción</h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product.description || "<p>Sin descripción</p>",
                }}
              />
            </CardContent>
          </Card>

          {/* Especificaciones */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Especificaciones</h3>
              {hasSpecifications ? (
                <div className="space-y-3">
                  {product.specifications.map((spec) => (
                      <div
                        key={spec.id}
                        className="flex justify-between pb-2 border-b last:border-0"
                      >
                        <span className="font-medium">{spec.name}:</span>
                        <span>{spec.value}</span>
                      </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-3">
                  Este producto no tiene especificaciones
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Acciones y otras tarjetas */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Acciones</h3>
              <div className="space-y-3">
                  <Button asChild className="w-full flex items-center">
                    <Link href={`/admin/products/update/${product.id}`}>
                    <Edit />
                      Editar producto
                    </Link>
                  </Button>
                <Button variant={"destructive"} className="w-full">
                    <Trash />
                  Eliminar producto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de información adicional */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Resumen</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ID del producto:
                  </span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-xs break-all max-w-[200px]">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Imágenes:</span>
                  <span>{product.images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Especificaciones:
                  </span>
                  <span>{product.specifications.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
