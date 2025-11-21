import { BookingManager } from "@/components/booking-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, Car } from "lucide-react";

export default async function BookingsManagementPage() {
  const supabase = await createClient();

  // Fetch all bookings with related data
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, tours(title), vehicles(name)")
    .order("created_at", { ascending: false });

  // Log error if any (for debugging)
  if (error) {
    console.error("Error fetching bookings:", error);
  }

  // Separate bookings by type
  const tourBookings = bookings?.filter((b) => b.booking_type === "tour") || [];
  const vehicleBookings = bookings?.filter((b) => b.booking_type === "vehicle") || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Manage Bookings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View and manage all tour and vehicle bookings
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Tour Bookings</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Manage all tour package bookings
                  </p>
                  <p className="text-sm font-medium">
                    {tourBookings.length} {tourBookings.length === 1 ? "booking" : "bookings"}
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/bookings/tours">
                    View Tours
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Vehicle Bookings</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Manage all vehicle rental bookings
                  </p>
                  <p className="text-sm font-medium">
                    {vehicleBookings.length} {vehicleBookings.length === 1 ? "booking" : "bookings"}
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/bookings/vehicles">
                    View Vehicles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Bookings List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
          {bookings && bookings.length > 0 ? (
            <BookingManager initialBookings={bookings} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-semibold mb-2">No bookings yet</p>
                <p className="text-sm text-muted-foreground">
                  Bookings will appear here when customers make reservations
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

