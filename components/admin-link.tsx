"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import Link from "next/link";

export function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Check admin status
      const adminCheck = 
        user.user_metadata?.role === "admin" || 
        user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        user.email?.endsWith("@admin.srilankatourism.com");

      if (adminCheck) {
        setIsAdmin(true);
        return;
      }

      // Also check profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      setIsAdmin(profile?.role === "admin" || false);
    };

    checkAdmin();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link href="/admin">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Admin
      </Button>
    </Link>
  );
}

