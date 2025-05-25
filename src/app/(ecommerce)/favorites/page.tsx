import { FavoritesList } from "@/features/favorites/components/FavoritesList";

export const metadata = {
  title: "Mis favoritos | My Ecommerce",
  description: "Productos guardados como favoritos",
};

export default function FavoritesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mis favoritos</h1>
      <FavoritesList />
    </div>
  );
}
