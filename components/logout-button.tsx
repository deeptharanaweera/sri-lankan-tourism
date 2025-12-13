"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Use window.location for full page reload to clear session
    window.location.href = "/auth/login";
  };

  return <Button onClick={logout}>Logout</Button>;
}
