import { AdminSidebar } from "@/components/admin-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function checkAdminAccess() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  // Check if user has admin role
  let isAdmin = 
    user.user_metadata?.role === "admin" || 
    user.email === process.env.ADMIN_EMAIL ||
    user.email?.endsWith("@admin.srilankatourism.com");

  // Also check the profiles table
  if (!isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    isAdmin = profile?.role === "admin";
  }

  if (!isAdmin) {
    redirect("/");
  }

  return { user };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await checkAdminAccess();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar user={user} />
      <div className="lg:pl-64">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

