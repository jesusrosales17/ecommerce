import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Descripción
      </h2>
      <div
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
