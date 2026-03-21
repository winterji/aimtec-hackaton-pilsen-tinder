"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith("/auth");
  const [isChecking, setIsChecking] = useState(!isAuthPage);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (isAuthPage) {
      if (token) {
        router.replace("/");
      }
      return;
    }

    if (!token) {
      router.replace("/auth/sign-in");
    } else {
      setIsChecking(false);
    }
  }, [pathname, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isChecking) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
