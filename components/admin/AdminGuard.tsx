"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const LOGIN_PATH = "/admin/login";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === LOGIN_PATH) {
      if (user && isAdmin) {
        router.replace("/admin");
      }
      return;
    }
    if (!user || !isAdmin) {
      router.replace(LOGIN_PATH);
    }
  }, [loading, user, isAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (pathname === LOGIN_PATH) {
    return <>{children}</>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
