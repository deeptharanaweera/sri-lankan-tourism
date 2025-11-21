"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  tour_name: string | null;
  is_approved: boolean;
  created_at: string;
}

interface ReviewManagerProps {
  initialReviews: Review[];
}

export function ReviewManager({ initialReviews }: ReviewManagerProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (id: string) => {
    setLoading(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      alert("Error approving review: " + error.message);
      setLoading(null);
      return;
    }

    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, is_approved: true } : review
      )
    );
    setLoading(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setLoading(id);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      alert("Error deleting review: " + error.message);
      setLoading(null);
      return;
    }

    setReviews(reviews.filter((review) => review.id !== id));
    setLoading(null);
    router.refresh();
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-semibold mb-2">No reviews yet</p>
          <p className="text-sm text-muted-foreground">
            Reviews will appear here when customers submit them
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{review.user_name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  {review.is_approved ? (
                    <Badge variant="default">Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                {review.tour_name && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Tour: {review.tour_name}
                  </p>
                )}
                <p className="text-sm mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleString()}
                </p>
              </div>
              {!review.is_approved && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                    disabled={loading === review.id}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    disabled={loading === review.id}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {review.is_approved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
                  disabled={loading === review.id}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

