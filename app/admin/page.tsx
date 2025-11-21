import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      color: "text-blue-500",
    },
    {
      title: "Total Bookings",
      value: bookingsResult.count || 0,
      icon: Calendar,
      color: "text-green-500",
    },
    {
      title: "Vehicles",
      value: vehiclesResult.count || 0,
      icon: Car,
      color: "text-orange-500",
    },
    {
      title: "Reviews",
      value: reviewsResult.count || 0,
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ];

  // Fetch recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, tours(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Overview of your website management
          </p>
        </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto flex-col py-6" asChild>
                  <Link href="/admin/tours">
                    <Plane className="h-8 w-8 mb-2" />
                    Manage Tours
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-6" asChild>
                  <Link href="/admin/gallery">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    Manage Gallery
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-6" asChild>
                  <Link href="/admin/bookings">
                    <Calendar className="h-8 w-8 mb-2" />
                    View Bookings
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-6" asChild>
                  <Link href="/admin/vehicles">
                    <Car className="h-8 w-8 mb-2" />
                    Manage Vehicles
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-6" asChild>
                  <Link href="/admin/reviews">
                    <MessageSquare className="h-8 w-8 mb-2" />
                    Manage Reviews
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest tour and vehicle bookings</CardDescription>
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
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">
                          {booking.tours?.title || "Vehicle Rental"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.users?.email || booking.email || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${booking.total_amount || booking.amount || 0}</p>
                        <Badge
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
                <p className="text-center text-muted-foreground py-8">
                  No bookings yet
                </p>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

