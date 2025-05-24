'use client';
import { Button } from "@/components/ui/button";
import { IoLogoGoogle } from "react-icons/io";
import { signIn } from 'next-auth/react';
import { useCartStore } from "@/features/cart/store/useCartStore";



export const GoogleAuthButton = () => {
  const {redirectAfterLogin} = useCartStore();
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: redirectAfterLogin || '/' });
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-full h-10 sm:h-11 bg-white text-gray-900 border-gray-300 hover:bg-gray-100 text-xs sm:text-sm"
    >
      <IoLogoGoogle className="mr-2" size={18} />
      Iniciar sesión con Google
    </Button>
  );
};
