import { ProductDescription } from "./ProductDescription";
import { ProductSpecs } from "./ProductSpecs";
import { KeyFeatures } from "./KeyFeatures";
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
            <ProductSpecs
              categoryName={product.category?.name}
              stock={product.stock}
              specifications={product.specifications}
            />
          </div>

          {/* Características principales */}

          <div className="border-t border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Características principales
            </h2>
            <KeyFeatures specifications={product.specifications} />
          </div>
        </div>
      </div>
    </div>
  );
};
