"use client";

import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Clock, MapPin, Search, Star, Users } from "lucide-react";
import Image from "next/image";

interface ToursListProps {
  tours: TourItem[];
}

interface TourItem {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: number | string | null;
  location: string | null;
  max_group_size: number | null;
  rating: number | null;
  reviews_count: number | null;
  highlights: string[] | null;
  image_url: string | null;
}

interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  bookingDate: string;
  returnDate: string;
  numberOfPeople: string;
  specialRequests: string;
}

const defaultForm: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  bookingDate: "",
  returnDate: "",
  numberOfPeople: "1",
  specialRequests: "",
};

export function ToursList({ tours }: ToursListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const supabase = createClient();

  const filteredTours = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return tours;
    }

    return tours.filter((tour) => {
      const titleMatch = tour.title.toLowerCase().includes(query);
      const locationMatch = tour.location?.toLowerCase().includes(query);
      const highlightsMatch = tour.highlights?.some((highlight) =>
        highlight.toLowerCase().includes(query),
      );

      return titleMatch || locationMatch || highlightsMatch;
    });
  }, [searchQuery, tours]);

  const handleOpenBooking = (tourId: string) => {
    setSelectedTourId(tourId);
    setFormData(defaultForm);
    setFeedback(null);
  };

  const handleCloseBooking = () => {
    setSelectedTourId(null);
    setFormData(defaultForm);
    setFeedback(null);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTourId) {
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.bookingDate) {
      setFeedback({ type: "error", message: "Please fill in the required fields." });
      return;
    }

    const tour = tours.find((item) => item.id === selectedTourId);
    if (!tour) {
      setFeedback({ type: "error", message: "Unable to find selected tour." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const peopleCount = Number.parseInt(formData.numberOfPeople || "1", 10);
    const priceNumber = tour.price ? Number(tour.price) : null;
    const totalAmount = priceNumber !== null && !Number.isNaN(priceNumber)
      ? priceNumber * (Number.isNaN(peopleCount) ? 1 : peopleCount)
      : null;

    const { error } = await supabase.from("bookings").insert([
      {
        tour_id: tour.id,
        booking_type: "tour",
        booking_date: formData.bookingDate,
        return_date: formData.returnDate || null,
        number_of_people: Number.isNaN(peopleCount) ? 1 : peopleCount,
        total_amount: totalAmount,
        contact_email: formData.email.trim(),
        contact_phone: formData.phone.trim() || null,
        special_requests: formData.specialRequests.trim() || null,
        status: "pending",
      },
    ]);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure bookings table RLS policies allow public inserts.";
      }
      setFeedback({ type: "error", message });
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setFeedback({ type: "success", message: "Booking submitted! We will contact you soon." });
    
    // Close modal after 2 seconds on success
    setTimeout(() => {
      setFormData(defaultForm);
      setSelectedTourId(null);
      setFeedback(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Tour Packages</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing tours across Sri Lanka with experienced guides and unforgettable experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tours by name, location, or highlights..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => {
              const highlights = tour.highlights ?? [];
              const ratingValue = tour.rating ?? 0;
              const reviewsCount = tour.reviews_count ?? 0;
              const priceNumber = tour.price ? Number(tour.price) : null;
              const isSelected = selectedTourId === tour.id;

              return (
                <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    {tour.image_url ? (
                      <Image
                        src={tour.image_url}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {ratingValue > 0 ? ratingValue.toFixed(1) : "4.5"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {highlights.map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="bg-background/90">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{tour.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tour.description || "Experience the best of Sri Lanka with this curated package."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {tour.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tour.duration}
                          </span>
                        )}
                        {tour.max_group_size && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max {tour.max_group_size}
                          </span>
                        )}
                      </div>
                      {tour.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {tour.location}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          {reviewsCount > 0 ? `${reviewsCount} reviews` : "Awaiting reviews"}
                        </div>
                        <div className="text-2xl font-bold">
                          {priceNumber !== null && !Number.isNaN(priceNumber) ? `$${priceNumber.toFixed(2)}` : "Contact"}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => handleOpenBooking(tour.id)}>
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No tours found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={selectedTourId !== null} onOpenChange={(open) => !open && handleCloseBooking()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTourId && tours.find((t) => t.id === selectedTourId)?.title}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to complete your tour booking
            </DialogDescription>
          </DialogHeader>
          {selectedTourId && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-name">Full Name *</Label>
                  <Input
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-email">Email *</Label>
                  <Input
                    id="modal-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-phone">Phone</Label>
                  <Input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-numberOfPeople">Number of People</Label>
                  <Input
                    id="modal-numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    min="1"
                    value={formData.numberOfPeople}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-bookingDate">Start Date *</Label>
                  <Input
                    id="modal-bookingDate"
                    name="bookingDate"
                    type="date"
                    value={formData.bookingDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-returnDate">End Date</Label>
                  <Input
                    id="modal-returnDate"
                    name="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-specialRequests">Special Requests</Label>
                <Textarea
                  id="modal-specialRequests"
                  name="specialRequests"
                  placeholder="Let us know if you have any specific requirements"
                  value={formData.specialRequests}
                  onChange={handleFormChange}
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Booking"}
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
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


