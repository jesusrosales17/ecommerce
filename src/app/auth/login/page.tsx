import { Logo } from "@/components/template/Logo";
import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="max-w-[2000px] mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[45%_55%] h-svh">
      {/* left section */}
      <div className="flex my-4 xl:my-3 flex-col h-full w-full px-4 sm:px-6 sm:w-5/6 md:w-5/6 2xl:w-4/6 mx-auto ">
        {/* Header fixed at top */}
        <header className="">
          <Logo /> 
        </header>

        {/* Content and form centered */}
        <div className="flex flex-col grow justify-center px-2 sm:px-4 w-full">
          <div className="mb-2 sm:mb-3 lg:mb-4">
            <h1 className="text-2xl xl:text-3xl 2xl:text-4xl sm:text-4xl  font-bold mb-2 sm:mb-4">
              Bienvenido de nuevo
            </h1>
            <p className="text-base sm:text-base lg:text-base text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Crea una aqui
              </a>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* right section */}
      <div className="bg-linear-120 from-gray-200 to-sky-300 m-3 sm:m-5 md:m-7 rounded-lg overflow-hidden relative hidden lg:flex lg:flex-col lg:justify-center lg:items-center">
        <Image
          src="/images/login-bg.png"
          alt="signin"
          width={800}
          height={1000}
          className="h-full object-cover"
          priority
        />
      </div>
    </main>
  );
};

export default page;
