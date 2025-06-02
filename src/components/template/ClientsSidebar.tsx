"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { SheetTrigger, SheetContent, SheetTitle, Sheet } from "../ui/sheet";
import CategoryMenu from "./CategoryMenu";
import LogoutButton from "./LogoutButton";
import { Category } from "@prisma/client";
import { Session } from "next-auth";
import {
  Menu,
  Navigation,
  Percent,
  Settings,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";

interface Props {
  categories: Category[];
  session: Session;
}

const ClientsSidebar = ({ categories, session }: Props) => {
  // Estado para controlar la apertura y cierre del sidebar
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el sidebar cuando se hace clic en un elemento del menú
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <div className="py-4">
          <SheetTitle className="text-lg font-semibold mb-4 px-4  pb-2">
            Menú
          </SheetTitle>{" "}
          <nav className="flex flex-col space-y-2 px-4">
            {/* Categorías con menú desplegable hacia abajo */}
            <CategoryMenu
              categories={categories}
              onLinkClick={handleLinkClick}
            />
            {/* Destacados */}
            <Link
              href="/featured"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
            >
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Destacados</span>
            </Link>

            {/* Descuentos */}
            <Link
              href="/sales"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
            >
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span>Descuentos</span>
            </Link>

            {/* Opciones de usuario (solo si hay sesión) */}
            {session && (
              <>
                {/* Separador */}
                <div className="border-t my-2" /> {/* Mi cuenta */}
                {/* Mis pedidos */}
                <Link
                  href="/orders"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>Mis pedidos</span>
                </Link>
                {/* direcciones  */}
                <Link
                  href="/addresses"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span>Mis direcciones</span>
                </Link>
                {session.user.role === "USER" && (
                  <>
                    {/* Separador */}
                    <Link
                      href="/settings"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Configuraciones</span>
                    </Link>
                  </>
                )}
                {/* Panel de administración (solo para admin) */}
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Panel de administración</span>
                  </Link>
                )}
                {/* Cerrar sesión */}
                <LogoutButton />
              </>
            )}

            {/* Opciones de iniciar sesión/registro (cuando no hay sesión) */}
            {!session && (
              <>
                {/* Separador */}
                <div className="border-t my-2" /> {/* Iniciar sesión */}
                <Link
                  href="/auth/login"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Iniciar sesión</span>
                </Link>
                {/* Registrarse */}
                <Link
                  href="/auth/register"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ClientsSidebar;
