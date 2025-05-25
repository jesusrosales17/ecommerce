import { Logo } from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Heart,
  Menu,
  User,
  ChevronDown,
  Star,
  Percent,
} from "lucide-react";
import { Category } from "@prisma/client";
import { HeaderClient } from "./HeaderClient";
import { CartToggleButton } from "@/features/cart/components/CartToggleButton";
import { SearchProduct } from "@/features/products/components/SearchProduct";
import { CategoryMenu } from "./CategoryMenu";

const HeaderEcommerce = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
    method: "GET",
    cache: "no-store",
  });

  const categories: Category[] = (await res.json().catch(() => [])) || [];

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-40">
      <div className="xl:container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <Logo /> {/* Icons en mobile */}
          <div className="md:hidden flex items-center gap-4">
            {/* Búsqueda en versión móvil */}
            <SearchProduct compact={true} />
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
            </DropdownMenu>{" "}
            {/* Menú hamburguesa para móviles */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left">
                <div className="py-4">

              <SheetTitle className="text-lg font-semibold mb-4 px-4  pb-2" >Menú</SheetTitle>
                 
                  <nav className="flex flex-col space-y-2 px-4">
                    {/* Categorías con menú desplegable hacia abajo */}
                    <CategoryMenu categories={categories} />

                    {/* Destacados */}
                    <Link
                      href="/featured"
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                    >
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>Destacados</span>
                    </Link>

                    {/* Descuentos */}
                    <Link
                      href="/sales"
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                    >
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span>Descuentos</span>
                    </Link>


                    {/* Otros enlaces o acciones futuras */}
                    {/* Puedes agregar más aquí si es necesario */}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden md:flex justify-between flex-grow w-full">
          {/* Menú superior */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Hover de categorías */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-muted-foreground hover:text-primary"
                >
                  Categorías
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 max-h-64 overflow-y-auto"
                align="start"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <DropdownMenuItem key={cat.id || cat.name} asChild>
                      <Link
                        href={`/categories/${cat.name}`}
                        className="text-sm w-full"
                      >
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>Sin categorías</DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/categories"
                    className="text-sm text-primary w-full"
                  >
                    Ver todas las categorías
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enlaces principales */}
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
          </nav>{" "}
          {/* buscador */}
          <SearchProduct classname="flex-1 md:justify-end mr-3" />
          {/* Acciones (desktop) */}
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
