"use client";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserInfo = { email?: string | null } | null;

export function AuthButton() {
  const [user, setUser] = useState<UserInfo>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser({ email: data.user?.email ?? null });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getUser();
      setUser({ email: data.user?.email ?? null });
    });

    return () => {
      sub.subscription?.unsubscribe();
    };
  }, []);

  return user?.email ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      {/* <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button> */}
    </div>
  );
}


