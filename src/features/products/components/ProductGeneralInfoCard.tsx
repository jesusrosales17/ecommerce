import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Package } from "lucide-react";
import { formattedPrice } from "@/utils/price";

interface ProductGeneralInfoCardProps {
  price: number;
  stock: number;
  isOnSale: boolean;
  salePrice?: number | null;
  isFeatured: boolean;
  brand?: string | null;
  color?: string | null;
}

export const ProductGeneralInfoCard = ({
  price,
  stock,
  isOnSale,
  salePrice,
  isFeatured,
  brand,
  color,
}: ProductGeneralInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Información general</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Precio */}
          <div className="flex items-center">
            <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">
              {isOnSale && salePrice ? (
                <>
                  <span className="line-through text-xs mr-1">
                    {formattedPrice(price)}
                  </span>
                  <span>{formattedPrice(salePrice)}</span>
                </>
              ) : (
                formattedPrice(price)
              )}
            </span>
          </div>
          
          {/* Stock */}
          <div className="flex items-center">
            <Package className="h-5 w-5 text-muted-foreground mr-2" />
            <span
              className={`font-medium ${stock <= 5 ? "text-red-600" : ""}`}
            >
              {" "}
              {stock} unidades
            </span>
          </div>
          
          {/* Destacado */}
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Destacado:</span>
            <span className="font-medium">{isFeatured ? "Sí" : "No"}</span>
          </div>
          
          {/* Oferta */}
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">En oferta:</span>
            <span className="font-medium">{isOnSale ? "Sí" : "No"}</span>
          </div>

          {/* Brand */}
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Marca:</span>
            <span className="font-medium">{brand ?? "Sin marca"}</span>
          </div>
          
          {/* Color */}
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Color:</span>
            <span className="font-medium">{color ?? "Sin color"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
