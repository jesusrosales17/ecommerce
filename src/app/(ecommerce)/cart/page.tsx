import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCartWithTotals } from "@/features/cart/server/cart-utils";
import { CheckoutButton } from "@/features/checkout/components/CheckoutButton";
import { getSession } from "@/libs/auth/auth";
import { formatPrice } from "@/utils/price";

export default async function CartPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/cart");
  }
  const cartData = await getCartWithTotals();

  // Añadimos verificación de existencia más estricta para evitar errores de tipo
  const cartItems = cartData?.cart?.items ?? [];
  const cartTotal = cartData?.cartTotal ?? 0;
  const itemsCount = cartData?.itemsCount ?? 0;

  return (
    <div className="container py-8 mx-auto px-4 2xl:px-0 min-h-[100dvh]">
      <h1 className="text-2xl font-bold mb-6">Mi carrito</h1>

      {cartItems.length === 0 ? (
        <div className="text-center p-12 border rounded-md">
          <h2 className="text-lg font-medium mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Parece que aún no has agregado ningún artículo a tu carrito.
          </p>
          <Button asChild>
            <Link href="/products">Explorar productos</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {cartItems.map((item ) => {
                    const product = item.Product;
                    const image =
                      product?.images?.find((img) => img.isPrincipal) ||
                      product?.images?.[0];
                    const price =
                      product?.isOnSale && product?.salePrice
                        ? Number(product.salePrice)
                        : Number(product?.price);

                    return (
                      <div key={item.id} className="flex border-b pb-4">
                        <div className="h-24 w-24 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {image && (
                            <Image
                              src={`/api/uploads/products/${image.name}`}
                              alt={product?.name || "Producto"}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <Link
                            href={`/products/${product?.id}`}
                            className="font-medium hover:underline"
                          >
                            {product?.name}
                          </Link>

                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <span className="text-sm font-medium">
                                {formatPrice(price)}
                              </span>
                              {product?.isOnSale && (
                                <span className="text-xs text-gray-500 line-through ml-2">
                                  {formatPrice(Number(product.price))}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-sm">
                                Cantidad: <strong>{item.quantity}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-muted-foreground">
                            Subtotal:{" "}
                            <span className="font-medium">
                              {formatPrice(price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-80">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-4">Resumen del pedido</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Productos ({itemsCount}):</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <CheckoutButton cartEmpty={cartItems.length === 0} />

                  <Button variant="outline" asChild className="w-full mt-2">
                    <Link href="/products">Seguir comprando</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
