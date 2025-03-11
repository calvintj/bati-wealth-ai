"use client";

// Imports
import Image from "next/image";
import LoginForm from "@/components/login/login-form";

// Assets
import Bati from "@/assets/bati-logo.png";
import Polygon from "@/assets/polygon-one.png";
import Polygon2 from "@/assets/polygon-two.png";

const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-between bg-[#1D283A]">
      {/* Left decoration */}
      <div className="ml-20">
        <Image src={Polygon} alt="Polygon" width={320} height={320} />
      </div>

      {/* Login container */}
      <div className="border-2 border-white flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden text-black">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#1D283A]">
          <Image src={Bati} alt="Fund Manager CRM" width={320} height={320} />
          <p className="text-white text-center text-sm">
            Pantau interaksi dan investasi nasabah dengan lancar!
          </p>
        </div>

        {/* Login section */}
        <div className="p-4 flex flex-col">
          <div className="mb-2 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold mb-2">Selamat Datang!</p>
            <p>Masuk untuk mengelola dana Anda!</p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right decoration */}
      <div className="mr-20">
        <Image src={Polygon2} alt="Polygon 2" width={320} height={320} />
      </div>
    </div>
  );
};

export default LoginPage;
