interface Props {
    product: {
        category: string;
        color: string;
        stock: number;
    }
}

export const ProductSpecs = ({
    product
}: Props) => {
  return (
    <table className="mt-2 space-y-2 w-full">
      <tbody>
        <tr className="flex justify-between">
          <td className="text-gray-600">Categoría</td>
          <td className="font-medium text-gray-900">
            {product.category || "Sin categoría"}
          </td>
        </tr>
        <tr className="flex justify-between">
          <td className="text-gray-600">Stock disponible</td>
          <td className="font-medium text-gray-900">{product.stock} unidades</td>
        </tr>
        
       
      </tbody>
    </table>
  );
};
