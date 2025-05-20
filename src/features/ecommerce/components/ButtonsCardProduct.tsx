import { Button } from "@/components/ui/button";
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
        className="rounded-full  bg-white hover:bg-red-500 hover:text-white "
      >
        <Heart className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        className="rounded-md bg-gray-500 group-hover:bg-rose-600 text-white transition-colors duration-300 "
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ButtonsCardProduct;
