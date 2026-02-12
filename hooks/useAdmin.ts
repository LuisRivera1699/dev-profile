"use client";

import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
  const { user, isAdmin, loading } = useAuth();
  return { user, isAdmin, loading };
}
