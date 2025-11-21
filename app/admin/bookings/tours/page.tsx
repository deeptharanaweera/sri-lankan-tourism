import { BookingManager } from "@/components/booking-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TourBookingsPage() {
  const supabase = await createClient();

  // Fetch only tour bookings
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, tours(title), vehicles(name)")
    .eq("booking_type", "tour")
    .order("created_at", { ascending: false });

  // Log error if any (for debugging)
  if (error) {
    console.error("Error fetching tour bookings:", error);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/bookings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Tour Bookings</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Manage all tour package bookings
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {bookings && bookings.length > 0 ? (
          <BookingManager initialBookings={bookings} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-semibold mb-2">No tour bookings yet</p>
              <p className="text-sm text-muted-foreground">
                Tour bookings will appear here when customers make reservations
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

