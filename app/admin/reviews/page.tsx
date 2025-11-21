import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, X } from "lucide-react";
import { ReviewManager } from "@/components/review-manager";

export default async function ReviewsManagementPage() {
  const supabase = await createClient();

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Manage Reviews</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Approve, edit, and manage customer reviews
          </p>
        </div>

        {/* Reviews Manager */}
        <ReviewManager initialReviews={reviews || []} />
      </div>
    </div>
  );
}

