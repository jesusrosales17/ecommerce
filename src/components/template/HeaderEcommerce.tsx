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
import { Heart, LogIn, ShoppingCart, User } from "lucide-react";
import { getSession } from "@/libs/auth/auth";

const HeaderEcommerce = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, {
    method: "GET",
    cache: "no-store",
  });

  const categories = (await res.json().catch(() => [])) || [];
  const session = await getSession();
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <Logo />

          {/* Icons en mobile */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/favorites">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </Link>

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

        <div className="flex justify-between flex-grow w-full">
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
                    categories.map((cat: any) => (
                      <li key={cat.id || cat.slug || cat.name}>
                        <Link
                          href={`/category/${cat.slug || cat.id}`}
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
            </HoverCard>

            {/* Destacados y Descuentos */}

            <Button
              asChild
              variant="link"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/destacados">Destacados</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/descuentos">Descuentos</Link>
            </Button>
          </nav>

          {/* Acciones (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>

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

            {
              session && session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline">Panel</Button>
                </Link>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEcommerce;
