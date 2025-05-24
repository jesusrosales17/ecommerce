import { FooterEcommerce } from "@/components/template/FooterEcommerce"
import HeaderEcommerce from "@/components/template/HeaderEcommerce"
import { AuthProvider } from "@/app/providers" 
import { CartProvider } from "@/features/cart/components/CartProvider"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100">
      <AuthProvider>
        <CartProvider>
          <HeaderEcommerce />
          {children}
          <FooterEcommerce />
        </CartProvider>
      </AuthProvider>
    </div>
  )
}

export default layout