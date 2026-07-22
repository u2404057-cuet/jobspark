"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

const protectedRoutes = [
  "/dashboard",
  "/jobs/add",
  "/jobs/manage",
  "/ai-coach"
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (!isPending && isProtected && !session) {
      router.push("/login");
    }
  }, [session, isPending, isProtected, router]);

  if (isPending && isProtected) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  // If page is protected and we don't have a session, prevent rendering child content
  if (isProtected && !session && !isPending) {
    return null;
  }

  return <>{children}</>;
}
