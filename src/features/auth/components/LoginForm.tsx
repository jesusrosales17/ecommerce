"use client";

import { z } from "zod";

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
import { IoLogoGoogle } from "react-icons/io";

const formSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico no es válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg text-gray-600">Correo:</FormLabel>
              <FormControl>
                <Input className="h-10 sm:h-11" placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg text-gray-600">Password</FormLabel>
              <FormControl>
                <Input
                  className="h-10 sm:h-11"
                  type="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* olvide password */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-4">
          <p className="text-base sm:text-base lg:text-xs text-gray-600">
            ¿No tienes una cuenta? <a href="#" className="text-blue-600 hover:underline">Click aqui</a>
          </p>
          <a
            href="#"
            className="text-xs sm:text-sm lg:text-xs  font-semibold text-gray-600 hover:underline"
          >
            Olvidé mi contraseña
          </a>
        </div>
        <Button type="submit" className="w-full h-10 sm:h-11 bg-blue-900">
          Submit
        </Button>

        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <div className="h-px bg-gray-300 flex-grow mr-2"></div>
          <span className="text-gray-500 text-xs sm:text-sm">O</span>
          <div className="h-px bg-gray-300 flex-grow ml-2"></div>
        </div>

        <div className="flex items-center justify-center mt-3 sm:mt-4">
          <Button
            variant="outline"
            className="w-full h-10 sm:h-11 bg-white text-gray-900 border-gray-300 hover:bg-gray-100 text-xs sm:text-sm"
          >
            <IoLogoGoogle className="mr-2" size={18} />
            Iniciar sesión con Google
          </Button>
          </div>
      </form>
    </Form>
  );
}
