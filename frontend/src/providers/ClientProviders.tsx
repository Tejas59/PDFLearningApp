"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";


const QueryProvider = dynamic(() => import("@/providers/QueryProvider"), {
  ssr: false,
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
