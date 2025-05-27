import { CartButton } from "@/features/cart/components/CartButton";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";

interface Props {
    className?: string;
    productId: string;
}

const ButtonsCardProduct = ({ className, productId }: Props) => {
  return (
    <div className={`flex justify-between items-center mt-2 ${className}`}>
      <FavoriteButton productId={productId} />
      <CartButton
        productId={productId}
        variant="ghost"
        size="icon"
        className="group-hover:bg-red-500 hover:bg-red-500 hover:text-white  group-hover:text-white"
      />
    </div>
  );
};

export default ButtonsCardProduct;
