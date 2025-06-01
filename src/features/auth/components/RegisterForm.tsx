"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { GoogleAuthButton } from "../../../components/auth/GoogleAuthButton";
import { RegisterFormValues, registerSchema } from "../schemas/registerSchema";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const { register, isLoading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await register(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:space-y-8 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-base md:text-lg text-gray-600">
                Nombre completo:
              </FormLabel>
              <FormControl>
                <Input
                  className="h-10 sm:h-11"
                  placeholder="Tu nombre completo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-base md:text-lg text-gray-600">
                Correo:
              </FormLabel>
              <FormControl>
                <Input
                  className="h-10 sm:h-11"
                  placeholder="ejemplo@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-base md:text-lg text-gray-600">
                Contraseña
              </FormLabel>
              <div className="flex items-center">
                <FormControl>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    className="h-10 sm:h-11 pr-10 rounded-e-none"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <Button
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  type="button"
                  variant={"ghost"}
                  className="w-10 rounded-s-none border h-full inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {!passwordVisible ? (
                    <IoMdEye size={20} />
                  ) : (
                    <IoMdEyeOff size={20} />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-base md:text-lg text-gray-600">
                Confirmar contraseña
              </FormLabel>
              <div className="flex items-center">
                <FormControl>
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className="h-10 sm:h-11 pr-10 rounded-e-none"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <Button
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  type="button"
                  variant={"ghost"}
                  className="w-10 rounded-s-none border h-full inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {!confirmPasswordVisible ? (
                    <IoMdEye size={20} />
                  ) : (
                    <IoMdEyeOff size={20} />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Términos y condiciones */}
        <div className="flex items-center gap-2 mb-4 sm:mb-4">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            required
          />
          <label
            htmlFor="terms"
            className="text-sm sm:text-base text-gray-600"
          >
            Acepto los{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline font-semibold"
            >
              términos y condiciones
            </a>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-10 sm:h-11 bg-blue-900 mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <div className="flex items-center justify-between mb-4">
          <div className="h-px bg-gray-300 flex-grow mr-2"></div>
          <span className="text-gray-500 text-xs sm:text-sm">O</span>
          <div className="h-px bg-gray-300 flex-grow ml-2"></div>
        </div>

        <div className="flex items-center justify-center mt-3 sm:mt-4">
          <GoogleAuthButton />
        </div>
      </form>
    </Form>
  );
}
