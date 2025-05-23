import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ProductImagesCardProps {
  images: {
    id: string;
    name: string;
    productId: string;
  }[];
  productName: string;
}

export const ProductImagesCard = ({ images, productName }: ProductImagesCardProps) => {
  const hasImages = images.length > 0;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Imágenes</h3>
        {hasImages ? (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img) => (
              <Image
                key={img.id}
                src={`/api/uploads/products/${img.name}`}
                alt={productName}
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
  );
};
