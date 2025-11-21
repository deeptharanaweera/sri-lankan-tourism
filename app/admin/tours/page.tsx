import Link from "next/link";
import { Plus } from "lucide-react";

import { TourManager } from "@/components/tour-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function ToursManagementPage() {
  const supabase = await createClient();

  // Fetch tours
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Manage Tours</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Add, edit, and manage tour packages
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/tours/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Tour
            </Link>
          </Button>
        </div>

        {/* Tours List */}
        {tours && tours.length > 0 ? (
          <TourManager initialTours={tours} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold mb-2">No tours yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first tour package
              </p>
              <Button asChild>
                <Link href="/admin/tours/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tour
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

