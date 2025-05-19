"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, RefreshCcw, ShoppingCart } from "lucide-react";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formattedPrice } from "@/utils/price";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  isOnSale?: boolean;
  specifications?: {
    id: string;
    name: string;
    value: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  image: string;
  specs?: {
    label: string;
    value: string;
  }[];
}

export function ProductCard({
  id,
  name,
  price,
  salePrice,
  isOnSale,
  image,
  description,
  specs = [],
}: ProductCardProps) {
  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : null;

  return (
    <div className="group relative border rounded-2xl bg-white  hover:shadow-lg transition-all duration-300">
      <div className="relative ">
        {discount !== null && (
          <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        <div className="aspect-[4/3] relative overflow-hidden w-full">
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
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full shadow bg-white hover:bg-red-500 hover:text-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Nombre y precio */}
        <div className="mt-4 p-4">
          <Link href={`/product/${id}`}>
            <h3 className=" font-medium text-gray-900 hover:underline line-clamp-1">
              {name}
            </h3>
          </Link>

          <div className="mt-5 flex items-center justify-between ">
            <div className="flex  items-center gap-4">
              <span className="text-lg font-bold text-primary">
                {formattedPrice(salePrice ?? price)}
              </span>
              {salePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formattedPrice(price)}
                </span>
              )}
            </div>

            <Button
              size="icon"
              className="rounded-md bg-gray-500 group-hover:bg-rose-600 text-white"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 transition-all duration-300">
        <ul className="mt-2 text-xs text-gray-700 space-y-1">
          {specs.slice(0, 4).map((spec, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-dotted py-1"
            >
              <span className="text-gray-500">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
