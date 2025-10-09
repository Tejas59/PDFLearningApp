"use client";
import { userAuthStore } from "../../store/userAuthStore";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loader } from "../Loader";

const publicRoute = ["/login", "/registration"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading,} = userAuthStore();
  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicRoute.includes(pathname);
      if (!isAuthenticated && !isPublic) {
        router.push("/login");
      }
      if (isAuthenticated && isPublic) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <Loader type="default" position="center" />;
  }
  return <>{children}</>;
}
