import { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Recupera tu contraseña ingresando tu correo electrónico",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
