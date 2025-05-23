import { Badge } from "@/components/ui/badge";
import { formattedPrice } from "@/utils/price";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

interface Props {
  product: {
    name: string;
    price: number;
    salePrice?: number;
    isOnSale: boolean;
    stock: number;
    category?: string;
  };
}
export const ProductInfo = ({ product }: Props) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bolkd text-gray-900">{product.name}</h1>
        <Badge className="mt-2">
            {product.category || "Sin categoría"}
        </Badge>
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
            <span className="text-3xl font-bold text-gray-900">
              {formattedPrice(
                product.isOnSale ? product.salePrice! : product.price
              )}
            </span>
            {product.isOnSale && (
              <span className="text-lg text-gray-500 line-through">
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
      </div>
                {/* Botones de acción */}
      <div className="space-y-4">
        <div className="flex items-center">
          <label
            htmlFor="quantity"
            className="mr-4 text-sm font-medium text-gray-700"
          >
            Cantidad
          </label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
              disabled={product.stock <= 0}
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300">1</span>
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
              disabled={product.stock <= 0}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
            disabled={product.stock <= 0}
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Añadir al carrito
          </button>
          <button
            className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            title="Guardar en favoritos"
          >
            <HeartIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </>
  );
};
