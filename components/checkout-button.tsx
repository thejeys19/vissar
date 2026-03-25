"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  planId: "pro" | "business" | "lifetime";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/dashboard/billing");
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
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Please try again.");
        setLoading(false);
      }
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
