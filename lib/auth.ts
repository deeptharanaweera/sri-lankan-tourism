import { createClient } from "@/lib/supabase/server";

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  // Check if user has admin role in user_metadata or email
  const isAdmin = 
    user.user_metadata?.role === "admin" || 
    user.email === process.env.ADMIN_EMAIL ||
    user.email?.endsWith("@admin.srilankatourism.com");

  if (!isAdmin) {
    // Also check the profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    return profile?.role === "admin";
  }

  return isAdmin;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

