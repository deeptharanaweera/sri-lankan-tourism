"use client";

import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MessageSquare, Quote, Send, Sparkles, Star } from "lucide-react";
import Image from "next/image";

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
  const { scrollY, scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);

  const [formData, setFormData] = useState<ReviewFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [displayedReviews] = useState<ReviewItem[]>(reviews);

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

    // Clear success message after 5 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <Image
            src="/images/reviews_bg.jpg"
            alt="Traveller overlooking Sri Lankan mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </motion.div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Traveler Configurations</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Tourist <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Reviews</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
              Read genuine stories from travelers who have explored the wonders of Sri Lanka with us.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        <div className="space-y-12">

          {/* Reviews Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedReviews.map((review, index) => (
              <motion.div key={review.id} variants={fadeIn} custom={index}>
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm group overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
                          {review.user_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">{review.user_name}</CardTitle>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Quote className="h-8 w-8 text-muted-foreground/20 group-hover:text-primary/20 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {review.tour_name && (
                      <div className="inline-block px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">
                        {review.tour_name}
                      </div>
                    )}
                    <p className="text-muted-foreground text-sm leading-relaxed min-h-[80px]">
                      &quot;{review.comment}&quot;
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                      <Calendar className="h-3 w-3" />
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
              </motion.div>
            ))}
          </motion.div>

          {displayedReviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No reviews yet</h3>
              <p className="text-muted-foreground mt-2">Be the first to share your experience!</p>
            </motion.div>
          )}

          {/* Review Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-emerald-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold">Share Your Story</h3>
                    <p className="text-blue-100 opacity-90">
                      Your feedback helps us improve and inspires other travelers to discover the beauty of Sri Lanka.
                    </p>
                  </div>
                  <div className="relative z-10 mt-8">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-xs">
                          <Sparkles className="w-4 h-4 opacity-70" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-100 mt-2 font-medium">Join our community of happy travelers</p>
                  </div>

                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
                </div>

                <div className="md:col-span-3 p-8">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl">Write a Review</CardTitle>
                  </CardHeader>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-10 bg-muted/30 focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tourId">Tour</Label>
                        <select
                          id="tourId"
                          name="tourId"
                          value={formData.tourId}
                          onChange={handleTourChange}
                          className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                          className="bg-muted/30"
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
                            className="focus:outline-none hover:scale-110 transition-transform p-0.5"
                          >
                            <Star
                              className={`h-7 w-7 ${index < formData.rating
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                : "text-muted-foreground/40 hover:text-yellow-400/60"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Review <span className="text-destructive">*</span></Label>
                      <textarea
                        id="comment"
                        name="comment"
                        className="flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] focus:bg-background transition-colors resize-y"
                        placeholder="Tell us about your trip..."
                        value={formData.comment}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`p-3 rounded-md text-sm font-medium ${feedback.type === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-destructive/10 text-destructive"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {feedback.type === "success" ? <Sparkles className="h-4 w-4" /> : null}
                          {feedback.message}
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <Button type="submit" className="w-full h-11 text-base shadow-md" disabled={submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Submit Review
                            <Send className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        You must be logged in to submit a review.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


