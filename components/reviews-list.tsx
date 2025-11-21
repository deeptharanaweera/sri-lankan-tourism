"use client";

import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Star } from "lucide-react";

interface ReviewsListProps {
  reviews: ReviewItem[];
  tours: TourOption[];
}

interface ReviewItem {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  tour_name: string | null;
  created_at: string;
}

interface TourOption {
  id: string;
  title: string;
}

interface ReviewFormState {
  name: string;
  tourId: string;
  customTourName: string;
  rating: number;
  comment: string;
}

const defaultForm: ReviewFormState = {
  name: "",
  tourId: "",
  customTourName: "",
  rating: 5,
  comment: "",
};

export function ReviewsList({ reviews, tours }: ReviewsListProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState<ReviewFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewItem[]>(reviews);

  const tourOptions = useMemo(
    () => [{ id: "", title: "Select a tour" }, ...tours, { id: "custom", title: "Other (specify)" }],
    [tours],
  );

  const handleRatingClick = (rating: number) => {
    setFormData((previous) => ({ ...previous, rating }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((previous) => ({
      ...previous,
      tourId: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFeedback(null);

    if (!formData.name.trim()) {
      setFeedback({ type: "error", message: "Please provide your name." });
      return;
    }

    if (!formData.comment.trim()) {
      setFeedback({ type: "error", message: "Please share your experience." });
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      setFeedback({ type: "error", message: "Please log in to submit a review." });
      return;
    }

    const selectedTour = tours.find((tour) => tour.id === formData.tourId);
    const tourId = selectedTour ? selectedTour.id : null;
    const tourName = selectedTour
      ? selectedTour.title
      : formData.tourId === "custom"
      ? formData.customTourName.trim()
      : null;

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        user_name: formData.name.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        tour_id: tourId,
        tour_name: tourName,
        is_approved: false,
      },
    ]);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message = "Permission denied. Ensure your account has access to submit reviews.";
      }
      setFeedback({ type: "error", message });
      setSubmitting(false);
      return;
    }

    setFeedback({
      type: "success",
      message: "Thank you for your review! It will be published after moderation.",
    });
    setSubmitting(false);
    setFormData(defaultForm);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Tourist Reviews</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our travelers have to say about their experiences in Sri Lanka
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {displayedReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {review.user_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{review.user_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.tour_name && (
                    <p className="text-sm font-semibold text-primary">
                      {review.tour_name}
                    </p>
                  )}
                  <p className="text-muted-foreground">{review.comment}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {displayedReviews.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tourId">Tour</Label>
                    <select
                      id="tourId"
                      name="tourId"
                      value={formData.tourId}
                      onChange={handleTourChange}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {tourOptions.map((tour) => (
                        <option key={tour.id || "none"} value={tour.id}>
                          {tour.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.tourId === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customTourName">Tour Name</Label>
                    <Input
                      id="customTourName"
                      name="customTourName"
                      placeholder="Which tour did you take?"
                      value={formData.customTourName}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleRatingClick(index + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            index < formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review *</Label>
                  <textarea
                    id="comment"
                    name="comment"
                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Share your experience..."
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  {feedback && (
                    <p
                      className={
                        feedback.type === "success"
                          ? "text-sm text-green-600"
                          : "text-sm text-destructive"
                      }
                    >
                      {feedback.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    You must be logged in to submit a review.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


