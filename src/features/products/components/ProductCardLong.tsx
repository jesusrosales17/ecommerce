import Image from "next/image";
import { Product } from "../interfaces/product";
import { Badge } from "@/components/ui/badge";
import ButtonsCardProduct from "@/features/products/components/ButtonsCardProduct";
import { formattedPrice } from "@/utils/price";
import Link from "next/link";

interface Props {
  product: Product;
}
export const ProductCardLong = ({ product }: Props) => {
  const discount =
    product.salePrice && product.isOnSale
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;
    const image = product.images.find((image) => image.isPrincipal) || product.images[0];  
  return (
    <Link
      href={`/products/${product.id}`}
      key={product.id}
      className="p-4 group grid grid-cols-[35%_62%] lg:grid-cols-[1fr_3fr] gap-4 border-b items-center shadow cursor-default"
    >
      <Image
        src={`/api/uploads/products/${image?.name}`}
        alt={product.name}
        width={300}
        height={300}
        className="object-contain w-full full"
      />
      <div className="flex flex-col gap-5 h-full justify-center relative">
        <div>
          <h3 className="text-sm lg:text-xl mb-4 line-clamp-2">
            {product.name}
          </h3>
          <Badge>{product?.category?.name || "Sin categoria"}</Badge>
          <div className="mt-3 flex flex-col    ">
            <div className="flex flex-col-reverse gap-0">
              <span className="text-base lg:text-2xl font-medium  relative">
                {
                  <>
                    {product.isOnSale && product.salePrice
                      ? formattedPrice(product.salePrice)
                      : formattedPrice(product.price)}
                    {discount !== null && (
                      <span
                        className=" z-10 text-xs lg:text-sm text-green-400
                        font-semibold px-2 py-1 rounded"
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </>
                }
              </span>
              {product.isOnSale && product.salePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formattedPrice(product.price)}
                </span>
              )}
            </div>

            <ButtonsCardProduct className="justify-between lg:justify-start gap-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
