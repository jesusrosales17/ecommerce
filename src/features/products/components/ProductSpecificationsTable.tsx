import { ProductSpecification } from "@prisma/client";
import React from "react";

// excluir id del tipo Specification

interface Props {
  specifications: ProductSpecification[];
}


export const ProductSpecificationsTable = ({ specifications }: Props) => {
  return (
    <table className="mt-2 space-y-2 w-full">
      <tbody>
        {specifications.map((spec, i) => (
          <tr
            key={spec.id}
            className={`${i % 2 === 0 ? "bg-gray-200" : "bg-gray-50"}`}
          >
            <td className="text-gray-600 text-sm p-2">{spec.name}:</td>
            <td className="ml-1 text-sm font-medium text-gray-900 p-2">
              {spec.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
