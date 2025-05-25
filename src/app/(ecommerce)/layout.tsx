import { FooterEcommerce } from "@/components/template/FooterEcommerce"
import HeaderEcommerce from "@/components/template/HeaderEcommerce"
import { AuthProvider } from "@/app/providers" 
import { CartProvider } from "@/features/cart/components/CartProvider"
import { FavoriteProvider } from "@/features/favorites/components/FavoriteProvider"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100">
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            <HeaderEcommerce />
            {children}
            <FooterEcommerce />
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  )
}

export default layout