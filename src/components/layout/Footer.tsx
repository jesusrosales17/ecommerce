import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Sobre Nosotros</h3>
            <p className="text-sm">
              Tu tienda online de confianza para encontrar los mejores productos
              al mejor precio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="hover:text-white transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Servicio al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Suscríbete para recibir nuestras últimas ofertas y novedades
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-gray-800 border-gray-700"
              />
              <Button>Suscribir</Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Tu Ecommerce. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 