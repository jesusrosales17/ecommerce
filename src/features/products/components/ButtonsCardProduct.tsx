import { Button } from "@/components/ui/button";
import { CartButton } from "@/features/cart/components/CartButton";
import { Heart } from "lucide-react";

interface Props {
    className?: string;
    productId: string;
}

const ButtonsCardProduct = ({ className, productId }: Props) => {
  return (
    <div className={`flex justify-between items-center mt-2 ${className}`}>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full bg-white hover:bg-red-500 hover:text-white transition-all duration-300 "
      >
        <Heart className="h-4 w-4" />
      </Button>
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
