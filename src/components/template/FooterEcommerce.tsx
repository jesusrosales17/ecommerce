import Link from "next/link";
import { ChevronRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Category } from "@prisma/client";
import { Logo } from "./Logo";
import { IoLogoWhatsapp } from "react-icons/io";

export async function FooterEcommerce() {
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/categories`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const categories: Category[] =
    (await categoriesRes.json().catch(() => [])) || [];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start  ">
          <Logo />
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Sobre Nosotros
            </h3>
            <p className="text-sm">
              Tu tienda online de confianza para encontrar los mejores productos
              al mejor precio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="hover:text-white transition-colors"
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Categorías
            </h3>
            <ul className="space-y-2">
              {categories.slice(0,4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.name}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors flex items-center"
                >
                  Ver todas las categorías
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Jesus Rosales Castillo. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <IoLogoWhatsapp className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
