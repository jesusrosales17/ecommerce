import { Logo } from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Heart,  ShoppingCart, User } from "lucide-react";
import { getSession } from "@/libs/auth/auth";
import { Category } from "@prisma/client";
import { HeaderClient } from "./HeaderClient";
import { CartToggleButton } from "@/features/cart/components/CartToggleButton";
import { CartButton } from "@/features/cart/components/CartButton";

const HeaderEcommerce = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
    method: "GET",
    cache: "no-store",
  });

  const categories: Category[] = (await res.json().catch(() => [])) || [];
  const session = await getSession();
  return (
    <header className="w-full bg-white  shadow-md sticky top-0 z-40">
      <div className="xl:container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <Logo />          {/* Icons en mobile */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/favorites">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </Link>
            
            {/* CartToggleButton en versión móvil */}
            <CartToggleButton showCount={true} />

            {/* Dropdown de cuenta en mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <User className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Iniciar sesión</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/register">Registrarse</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden md:flex justify-between flex-grow w-full">
          {/* Menú superior */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Hover de categorías */}
            <HoverCard openDelay={0} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button variant="link">Categorías</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 max-h-64 overflow-y-auto">
                <ul className="space-y-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat.id  || cat.name}>
                        <Link
                          href={`/categories/${cat.name}`}
                          className="text-sm hover:underline block"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      Sin categorías
                    </li>
                  )}
                </ul>
              </HoverCardContent>
            </HoverCard>            {/* Enlaces principales */}
            
            {/* <Button
              asChild
              variant="link"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/products">Todos los productos</Link>
            </Button> */}
            
            <Button
              asChild
              variant="link"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/featured">Destacados</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/sales">Descuentos</Link>
            </Button>
          </nav>          {/* Acciones (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Reemplazado con HeaderClient */}
            <HeaderClient />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEcommerce;
