"use client";

import { TokenManager } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !TokenManager.getAccess()) {
      router.replace('/login');
    }
  }, [mounted, router]);

  if (!mounted) return null; // avoid rendering on server

  return <>{children}</>;
}