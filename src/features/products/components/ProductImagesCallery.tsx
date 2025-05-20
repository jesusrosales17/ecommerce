"use client";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: { name: string }[];
  alt: string;
}

export default function ProductImagesGallery({ images, alt }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
      {/* Miniaturas */}
      <div className="flex md:flex-col gap-2">
        {images.map((img, idx) => (
          <button
            key={img.name}
            onClick={() => setSelected(idx)}
            className={`border-2 rounded-md overflow-hidden ${
              selected === idx ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <Image
              src={`/api/uploads/products/${img.name}`}
              alt={alt}
              width={70}
              height={70}
              className="object-cover rounded-md"
            />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="relative w-full h-[400px] md:w-[400px] md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={`/api/uploads/products/${images[selected]?.name}`}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
