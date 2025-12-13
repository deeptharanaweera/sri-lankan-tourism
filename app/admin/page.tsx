import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Car, Image as ImageIcon, MessageSquare, Plane } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch statistics
  const [toursResult, bookingsResult, vehiclesResult, reviewsResult] = await Promise.all([
    supabase.from("tours").select("id", { count: "exact" }),
    supabase.from("bookings").select("id", { count: "exact" }),
    supabase.from("vehicles").select("id", { count: "exact" }),
    supabase.from("reviews").select("id", { count: "exact" }),
  ]);

  const stats = [
    {
      title: "Total Tours",
      value: toursResult.count || 0,
      icon: Plane,
      description: "Active travel packages",
      className: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    },
    {
      title: "Total Bookings",
      value: bookingsResult.count || 0,
      icon: Calendar,
      description: "Reservations made",
      className: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
    },
    {
      title: "Vehicles",
      value: vehiclesResult.count || 0,
      icon: Car,
      description: "Fleet available",
      className: "bg-gradient-to-br from-orange-500 to-red-600 text-white",
    },
    {
      title: "Reviews",
      value: reviewsResult.count || 0,
      icon: MessageSquare,
      description: "Customer feedback",
      className: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white",
    },
  ];

  // Fetch recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, tours(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`${stat.className} border-none shadow-lg transition-all hover:scale-105 hover:shadow-xl`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 text-white/90">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-white/75 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Bookings */}
        <Card className="col-span-4 shadow-sm border-none bg-card/50">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest tour and vehicle requests from customers.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking: {
                  id: string;
                  tours?: { title: string } | null;
                  users?: { email: string } | null;
                  email?: string | null;
                  total_amount?: number | null;
                  amount?: number | null;
                  status?: string | null;
                  created_at: string;
                }) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {booking.tours?.title || "Vehicle Rental"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.users?.email || booking.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-sm">${booking.total_amount || booking.amount || 0}</p>
                      <Badge
                        className="mt-1"
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {booking.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4 opacity-20" />
                <p>No bookings found yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3 shadow-sm border-none bg-card/50">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Manage your content securely.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              { title: "Manage Tours", icon: Plane, href: "/admin/tours", color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Manage Gallery", icon: ImageIcon, href: "/admin/gallery", color: "text-purple-500", bg: "bg-purple-500/10" },
              { title: "View Bookings", icon: Calendar, href: "/admin/bookings", color: "text-green-500", bg: "bg-green-500/10" },
              { title: "Manage Vehicles", icon: Car, href: "/admin/vehicles", color: "text-orange-500", bg: "bg-orange-500/10" },
              { title: "Customer Reviews", icon: MessageSquare, href: "/admin/reviews", color: "text-pink-500", bg: "bg-pink-500/10" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="group flex items-center gap-4 rounded-xl border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`h-12 w-12 rounded-lg ${action.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">Click to open</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-muted-foreground">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

