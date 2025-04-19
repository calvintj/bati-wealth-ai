"use client";

import Image from "next/image";
import LoginForm from "@/components/login/login-form";
import { ColorModeToggle } from "@/components/chatbot/color-mode-toggle";
import { useTheme } from "next-themes";

// Assets
import Polygon from "@/assets/polygon-one.png";
import Polygon2 from "@/assets/polygon-two.png";

const LoginPage = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center dark:bg-[#1D283A] relative">
      {/* Left decoration (hidden on small screens) */}
      <div className="hidden md:block md:ml-20">
        <Image src={Polygon} alt="Polygon" width={320} height={320} />
      </div>

      {/* Login container */}
      <div className="flex flex-col items-center w-full md:w-auto">
        {/* Color mode toggle - now part of the normal flow */}
        <div className="self-end mb-4 md:absolute md:top-4 md:right-4">
          <ColorModeToggle />
        </div>

        <div className="w-11/12 max-w-md mx-auto my-8 md:my-0 border-2 border-gray-300 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden text-black">
          {/* Header section */}
          <div className="flex flex-col items-center justify-center p-8 dark:bg-[#1D283A]">
            {/* Use light or dark logo based on theme */}
            <Image
              src={theme === "dark" ? "/bati-dark.svg" : "/bati-light.svg"}
              alt="Fund Manager CRM"
              width={320}
              height={320}
            />
            <p className="text-white text-center text-sm mt-2">
              Pantau interaksi dan investasi nasabah dengan lancar!
            </p>
          </div>

          {/* Login section */}
          <div className="p-4 flex flex-col">
            <div className="mb-4 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold mb-1">Selamat Datang!</p>
              <p>Masuk untuk mengelola dana Anda!</p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right decoration (hidden on small screens) */}
      <div className="hidden md:block md:mr-20">
        <Image src={Polygon2} alt="Polygon 2" width={320} height={320} />
      </div>
    </div>
  );
};

export default LoginPage;
