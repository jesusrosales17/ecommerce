import { Badge } from "@/components/ui/badge";
import { formattedPrice } from "@/utils/price";
import ButtonsCardProduct from "./ButtonsCardProduct";
import { BuyNowButton } from "@/features/checkout/components/BuyNowButton";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    isOnSale: boolean;
    stock: number;
    category?: string;
    status: string;
  };
}

export const ProductInfo = ({ product }: Props) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bolkd text-gray-900">{product.name}</h1>
        <Badge className="mt-2">{product.category || "Sin categoría"}</Badge>
        {/* Rating y reviews */}
        {/* {product.reviews?.length > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-5 w-5 ${
                          rating < averageRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews.length} reseñas)
                  </span>
                </div>
              )} */}

        {/* Precio */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xl lg:text-3xl font-bold text-gray-900">
              {formattedPrice(
                product.isOnSale ? product.salePrice! : product.price
              )}
            </span>
            {product.isOnSale && (
              <span className="text-md lg:text-lg text-gray-500 line-through">
                {formattedPrice(product.price)}
              </span>
            )}
            {product.isOnSale && (
              <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {Math.round(
                  ((product.price - product.salePrice!) / product.price) * 100
                )}
                % OFF
              </span>
            )}
          </div>
          {product.isOnSale && (
            <p className="mt-1 text-sm text-green-600">
              Ahorras {formattedPrice(product.price - product.salePrice!)}
            </p>
          )}
        </div>

        {/* Disponibilidad */}
        <div className="mt-4">
          <p
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `Disponible (${product.stock} unidades)`
              : "Agotado"}
          </p>
        </div>
      </div>{" "}
      {/* Botones de acción */}
      <div className="space-y-4">
        {/* Utilizamos el componente BuyNowButton y AddToCartButton */}
        {product.status !== "ACTIVE" && (
          <p className="text-sm text-red-600">
            Este producto no está disponible para la compra.
          </p>
        )}
        {product.stock > 0 ? (
          <div className="flex items-end gap-3">
            <BuyNowButton
              productId={product.id}
              maxStock={product.stock}
              className="flex-1 w-full"
              showQuantitySelector={true}
            />

            <div>
              <ButtonsCardProduct productId={product.id} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Este producto está agotado.</p>
        )}
      </div>
    </>
  );
};
