"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formattedPrice } from "@/utils/price";
import ButtonsCardProduct from "@/features/ecommerce/components/ButtonsCardProduct";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  isOnSale?: boolean;
  category?: string | null;
  image: string;
}

export function ProductCard({
  id,
  name,
  price,
  salePrice,
  isOnSale,
  category,
  image,
}: ProductCardProps) {
  const discount =
    salePrice && isOnSale
      ? Math.round(((price - salePrice) / price) * 100)
      : null;

  return (
    <Link href={id} className="group  relative border lg:rounded-2xl bg-white  hover:shadow-lg transition-all duration-300 ">
      <div className="relative flex flex-col justify-between  h-full">
        <div className="aspect-[4/3] relative overflow-hidden w-full lg:border-b">
          <Image
            src={
              `/api/uploads/products/${image}` ||
              "/images/product-placeholder.png"
            }
            alt={name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 w-full"
          />

          {/* Botones flotantes */}
        </div>

        {/* Nombre y precio */}
        <div className="mt-1 p-4 pt-0 flex flex-col justify-between  flex-grow ">
          <div className="">
            <h3 className="  line-clamp-1">{name}</h3>
            <Badge>{category}</Badge>
            <div className="mt-3 flex items-center justify-between ">
              <div className="flex flex-col-reverse gap-0">
                <span className="text-lg font-bold text-primary relative">
                  {
                    <>
                      {isOnSale && salePrice
                        ? formattedPrice(salePrice)
                        : formattedPrice(price)}
                      {discount !== null && (
                        <span
                          className=" z-10 text-sm text-green-400
                        font-semibold px-2 py-1 rounded"
                        >
                          {discount}% OFF
                        </span>
                      )}
                    </>
                  }
                </span>
                {isOnSale && salePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formattedPrice(price)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <ButtonsCardProduct />
        </div>
      </div>
    </Link>
  );
}
