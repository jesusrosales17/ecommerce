
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{session.user?.name || 'Cuenta'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session.user.role === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Panel de administración</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/account">Mi cuenta</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">Mis pedidos</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-500 cursor-pointer"
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
