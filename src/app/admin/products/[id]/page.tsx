import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft, CalendarIcon, CircleDollarSign, Package, Tag, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/products/interfaces/product";
import { formattedPrice } from "@/utils/price";
import { formatRelativeTime } from "@/utils/date";
import Image from "next/image";

interface Props {
  params: { id: string };
}

const ProductViewPage = async ({ params }: Props) => {
  const { id } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-bold">Error al cargar</h1>
        <p className="text-muted-foreground">No fue posible obtener la información del producto.</p>
        <Link href="/admin/products">
          <Button variant="secondary">Volver a productos</Button>
        </Link>
      </div>
    );
  }

  const product: Product = await res.json();
  const hasImages = !!product.images.length;

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href="/admin/products" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="h-5 w-5 mr-1" /> Volver a productos
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">Detalles del producto</p>
        </div>
        <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"} className="uppercase">
          {product.status === "ACTIVE" ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images & Category & Dates */}
        <div className="space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Imágenes</h3>
              {hasImages ? (
                  <div className="grid grid-cols-2  gap-2">
                    {product.images.map((img) => (
                        <Image
                        key={img.id}
                          src={`/api/uploads/products/${img.name}`}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                    ))}
                    </div>
              ) : (
                <div className="border rounded-md p-6 text-center text-muted-foreground">
                  No hay imágenes disponibles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Categoría</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {product.category?.name ?? "Sin categoría"}
              </Badge>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Fechas</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Creado:</strong> {formatRelativeTime(product.createdAt)}
                </li>
                <li>
                  <strong>Actualizado:</strong> {formatRelativeTime(product.updatedAt)}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info, Price, Stock */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Información general</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm ">
                {/* Precio */}
                <div className="flex items-center ">
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium">
                    {product.isOnSale && product.salePrice
                      ? <>
                          <span className="line-through text-xs mr-1">{formattedPrice(product.price)}</span>
                          <span>{formattedPrice(product.salePrice)}</span>
                        </>
                      : formattedPrice(product.price)
                    }
                  </span>
                </div>
                {/* Stock */}
                <div className="flex items-center ">
                  <Package className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : ''}`}> {product.stock} unidades</span>
                </div>
                {/* Destacado */}
                <div className="flex items-center ">
                  <span className="text-muted-foreground">Destacado:</span>
                  <span className="font-medium">{product.isFeatured ? 'Sí' : 'No'}</span>
                </div>
                {/* Oferta */}
                <div className="flex items-center ">
                  <span className="text-muted-foreground">En oferta:</span>
                  <span className="font-medium">{product.isOnSale ? 'Sí' : 'No'}</span>
                </div>

                {/* brand */}
                <div className="flex items-center ">
                  <span className="text-muted-foreground">Marca:</span>
                  <span className="font-medium">{product.brand ?? 'Sin marca'}</span>
                </div>
                <div className="flex items-center ">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium">{product.color ?? 'Sin color'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Description & Specs */}
          <Tabs defaultValue="desc" className="space-y-4">
            <TabsList>
              <TabsTrigger value="desc">Descripción</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="desc">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-64">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.description || '<p>Sin descripción</p>' }}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs">
              <Card>
                <CardContent className="p-4">
                  {product.specifications.length > 0 ? (
                    <ScrollArea className="h-64">
                      <ul className="">
                        {product.specifications.map((spec, i) => (
                          <li key={spec.id} className={`grid grid-cols-2 p-2 border gap-2 ${i % 2 === 0 ? 'bg-gray-100' : ''}`}>
                            <span className="font-medium border-">{spec.name}</span>
                            <span>{spec.value}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  ) : (
                    <p className="text-center text-muted-foreground">Sin especificaciones</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Acciones</h3>
                <div className="flex flex-col space-y-2">
                  <Link href={`/admin/products/update/${product.id}`}>
                    <Button className="w-full" variant="outline">
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </Link>
                  <Button className="w-full" variant="destructive">
                    <Trash className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-sm space-y-2">
                <h3 className="text-lg font-semibold">Resumen</h3>
                <div className="flex justify-between"><span>ID:</span><span className="font-mono break-all">{product.id}</span></div>
                <div className="flex justify-between"><span>Imágenes:</span><span>{product.images.length}</span></div>
                <div className="flex justify-between"><span>Specs:</span><span>{product.specifications.length}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
