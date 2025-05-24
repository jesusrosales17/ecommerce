
import { CartToggleButton } from "@/features/cart/components/CartToggleButton";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/libs/auth/auth";
import { DropdownUserEcommerce } from "./DropdownUserEcommerce";

export const HeaderClient = async () => {
    const session = await getSession();

  return (
    <div className="flex items-center gap-4">      <Link href="/favorites">
        <Button variant="ghost" size="icon">
          <Heart className="w-5 h-5" />
        </Button>
      </Link>
      
      <CartToggleButton showCount={true} variant="ghost" />

      {!session && (
        <>
          <Link href="/auth/login">
            <Button variant="outline">Iniciar sesión</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Registrarse</Button>
          </Link>
        </>
      )}

      {session && (
        <DropdownUserEcommerce session={session} />
      )}
    </div>
  );
};
