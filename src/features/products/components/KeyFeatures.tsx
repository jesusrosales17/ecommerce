interface Props {
  product: {
    category: string;
    color: string;
    stock: number;
    brand: string;
  };
}
const features = [
  { label: "Categoría", value: "category" },
  { label: "Color", value: "color" },
  { label: "Stock disponible", value: "stock" },
  { label: "Marca", value: "brand" },
];

export const KeyFeatures = ({ product }: Props) => {
  return (
    <table className="mt-2 space-y-2 w-full">
      <tbody>
        {features.map((feature, i) => (
          <tr
            className={`${i % 2 === 0 ? "bg-gray-200" : "bg-gray-50"}`}
            key={feature.label}
          >
            <td className="text-gray-600 text-sm p-2">{feature.label}</td>
            <td className="ml-1 text-sm font-medium text-gray-900 p-2">
              {product[feature.value as keyof typeof product] ||
                "Sin información"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
