import { getInitials } from "@/libs/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { SignOutButton } from "../auth/SignOutButton";
import { getSessionServer } from "@/features/auth/utils/auth-server";

export const DropdownUser = async () => {
  const session = await getSessionServer(); // Obtener datos del usuario desde el servidor
  const userName = session?.user?.name || "Usuario"; // Nombre de usuario o "Usuario" por defecto
  const userImage = session?.user?.image || null; // Imagen del usuario si existe
  const initials = getInitials(userName); // Iniciales del usuario
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 hover:bg-transparent"
        >
          <Avatar className="h-8 w-8 bg-yellow-500 text-dark">
            {userImage && <AvatarImage src={userImage} alt={userName} />}
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-flex">
            {userName}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Configuración</DropdownMenuItem>
        <DropdownMenuItem>Facturación</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          <SignOutButton className="flex items-center gap-2 w-full">
            <span className="text-red-500">Cerrar Sesión</span>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
