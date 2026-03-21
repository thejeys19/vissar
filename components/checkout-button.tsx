"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  planId: "pro" | "business";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: session.user?.id || session.user?.email,
          email: session.user?.email || "",
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Redirecting..." : children}
    </Button>
  );
}
