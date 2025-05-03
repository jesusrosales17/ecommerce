import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    // grid [40, 60] for left and right sections, ajustado para móviles
    <main className="max-w-[2000px] mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[45%_55%] h-screen">
      
      {/* left section */}
      <div className="flex my-4 xl:my-3 flex-col h-full w-full px-4 sm:px-6 sm:w-5/6 md:w-5/6 2xl:w-4/6 mx-auto lg:gap-8">
        {/* Header fixed at top */}
        <header className="">
          <p className="text-xl sm:text-2xl flex items-center font-medium">
            <span className="text-white font-bold rounded-full px-2 sm:px-3 text-2xl sm:text-3xl bg-blue-900">E</span>commerce
          </p>
        </header>

        {/* Content and form centered */}
        <div className="flex flex-col grow justify-center px-2 sm:px-4 w-full">
          <div className="mb-2 sm:mb-3">
            <h1 className="text-2xl xl:text-3xl 2xl:text-4xl sm:text-4xl  font-bold mb-2 sm:mb-3">Bienvenido de nuevo</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Inicia sesión para acceder a tu cuenta y disfrutar de todas las
              funciones.
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
