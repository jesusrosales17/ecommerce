import { Button } from "@/components/ui/button";
import { FavoritesList } from "@/features/favorites/components/FavoritesList";
import { getSession } from "@/libs/auth/auth";
import { Info} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Mis favoritos ",
  description: "Productos guardados como favoritos",
};

export default async function FavoritesPage() {
  const session = await getSession();
  if(!session) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen">
        {/* necesitas estar logeado */}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Info className="w-12 h-12 text-gray-400" />
          <h1 className="text-2xl font-medium text-gray-600">
            Necesitas iniciar sesión para ver tus favoritos
          </h1>
          <Button asChild>
            <Link href="/auth/login">
              Iniciar sesión
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Mis favoritos</h1>
      <FavoritesList />
    </div>
  );
}
