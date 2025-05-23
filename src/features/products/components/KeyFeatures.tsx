import React from "react";

interface Specification {
  id: string;
  name: string;
  value: string;
}

interface KeyFeaturesProps {
  specifications: Specification[];
}

export const KeyFeatures = ({ specifications }: KeyFeaturesProps) => {
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
