import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Přihlášení | Plzeň Swipe Admin",
};

export default function SignIn() {
  return (
    // Celá obrazovka s jemným pozadím, obsah vycentrovaný
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      
      {/* Samotná přihlašovací karta */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 dark:bg-gray-800 dark:border-gray-700">
        
        {/* Logo (Vycentrované nahoře) */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            {/* Pokud máte vlastní textové logo, použijte toto: */}
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              Plzeň Swipe
            </h1>
            
            {/* Pokud si chcete nechat jejich obrázkové logo, odkomentujte toto: */}
            {/* <Image
              className="hidden dark:block"
              src={"/images/logo/logo.svg"}
              alt="Logo"
              width={176}
              height={32}
            />
            <Image
              className="dark:hidden"
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              width={176}
              height={32}
            /> 
            */}
          </Link>
        </div>

        {/* Uvítací text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Vítejte zpět
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Zadejte své údaje pro přístup do administrace.
          </p>
        </div>

        {/* Samotný formulář (přihlašovací inputy z vedlejší komponenty) */}
        <Signin />

      </div>
    </div>
  );
}