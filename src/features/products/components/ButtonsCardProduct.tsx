import { Button } from "@/components/ui/button";
import { CartButton } from "@/features/cart/components/CartButton";
import { Heart, ShoppingCart } from "lucide-react";

interface Props {
    className?: string;
}
const ButtonsCardProduct = ({className}: Props) => {
  return (
    <div className={`flex justify-between items-center mt-2 ${className}`}>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full  bg-white hover:bg-red-500 hover:text-white transition-all duration-300 group"
      >
        <Heart className="h-4 w-4" />
      </Button>
    <CartButton /> 
    </div>
  );
};

export default ButtonsCardProduct;
