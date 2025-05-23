import { ProductDescription } from "./ProductDescription";
import { KeyFeatures } from "./KeyFeatures";
import {  ProductSpecificationsTable } from "./ProductSpecificationsTable";
import { Product } from "../interfaces/product";

interface Props {
  product: Product;
}

export const ProductDetails = ({ product }: Props) => {
  return (
    <div className="border-t border-gray-200 px-6 py-8">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12">
        {/* Descripción */}
        <ProductDescription description={product.description!} />

        {/* Detalles */}
        <div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles del producto
            </h2>
            <KeyFeatures
              product={{
                category: product.category?.name,
                color: product.color || "Sin color",
                stock: product.stock || 0,
                brand: product.brand || "Sin marca",
              }}
            />
          </div>

          {/* Características principales */}

          <div className="border-t border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Especificaciones del producto
            </h2>
            <ProductSpecificationsTable specifications={product.specifications} />
          </div>
        </div>
      </div>
    </div>
  );
};
