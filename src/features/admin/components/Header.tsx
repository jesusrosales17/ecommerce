'use client';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { getInitials } from "@/libs/utils";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const Header = () => {
  

  return (
    <header>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 hover:bg-transparent"
          >
            {/* <Avatar className="h-8 w-8 bg-yellow-500 text-dark">
              {userImage && <AvatarImage src={userImage} alt={userName} />}
              <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline-flex">
              {userName}
            </span> */}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          {/* <DropdownMenuLabel className="text-xs font-normal opacity-60">{userEmail}</DropdownMenuLabel> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuItem>Facturación</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 p-0">
            <SignOutButton className="flex items-center gap-2 w-full p-2 justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar Sesión</span>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
