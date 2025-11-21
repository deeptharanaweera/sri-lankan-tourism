"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Hotel, Loader2, MapPin, DollarSign, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const hotelSchema = z.object({
  location: z.string().min(1, "Location is required"),
  budget: z.string().min(1, "Budget is required"),
  travelers: z.string().min(1, "Number of travelers is required"),
  preferences: z.string().min(1, "Please describe your preferences"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

type HotelForm = z.infer<typeof hotelSchema>;

interface HotelData {
  name: string;
  rating: number;
  stars: number;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  location: string;
  description: string;
  amenities: string[];
  highlights: string[];
  pros: string[];
  cons: string[];
  whySuitable: string;
  imageUrl: string;
}

export default function HotelsPage() {
  const [suggestions, setSuggestions] = useState<string>("");
  const [hotels, setHotels] = useState<HotelData[] | null>(null);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelForm>({
    resolver: zodResolver(hotelSchema),
  });

  const onSubmit = async (data: HotelForm) => {
    setLoading(true);
    setSuggestions("");
    setHotels(null);
    
    try {
      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to get hotel suggestions");
      }

      const result = await response.json();
      if (result.hotels && Array.isArray(result.hotels)) {
        setHotels(result.hotels);
      } else if (result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        setSuggestions("Sorry, there was an error getting hotel suggestions. Please try again.");
      }
    } catch (error) {
      console.error("Error getting hotel suggestions:", error);
      setSuggestions("Sorry, there was an error getting hotel suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Hotel className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Hotel Suggestions</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered hotel recommendations tailored to your preferences and budget
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Search Criteria</CardTitle>
                <CardDescription>
                  Tell us what you're looking for and we'll suggest the best hotels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Colombo, Kandy, Galle, Nuwara Eliya"
                      {...register("location")}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive">{errors.location.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">
                      <DollarSign className="inline h-4 w-4 mr-2" />
                      Budget Range
                    </Label>
                    <Input
                      id="budget"
                      placeholder="e.g., $50-$100 per night, Budget-friendly, Luxury"
                      {...register("budget")}
                    />
                    {errors.budget && (
                      <p className="text-sm text-destructive">{errors.budget.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelers">
                      Number of Travelers
                    </Label>
                    <Input
                      id="travelers"
                      placeholder="e.g., 2 people, Family of 4"
                      {...register("travelers")}
                    />
                    {errors.travelers && (
                      <p className="text-sm text-destructive">{errors.travelers.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in Date (Optional)</Label>
                      <Input id="checkIn" type="date" {...register("checkIn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out Date (Optional)</Label>
                      <Input id="checkOut" type="date" {...register("checkOut")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Preferences & Requirements</Label>
                    <textarea
                      id="preferences"
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Describe your preferences: e.g., beachfront, city center, mountain view, spa, pool, WiFi, family-friendly..."
                      {...register("preferences")}
                    />
                    {errors.preferences && (
                      <p className="text-sm text-destructive">{errors.preferences.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finding Hotels...
                      </>
                    ) : (
                      <>
                        <Hotel className="mr-2 h-4 w-4" />
                        Get Hotel Suggestions
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results - Side by side when no hotels, full width when hotels are shown */}
            {!hotels || hotels.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Hotels</CardTitle>
                  <CardDescription>
                    Your personalized hotel recommendations will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : suggestions ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap text-sm">{suggestions}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Hotel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Fill in the form and click "Get Hotel Suggestions" to find perfect accommodations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Hotels Grid - Full width when hotels are available */}
          {hotels && hotels.length > 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recommended Hotels</h2>
                <p className="text-muted-foreground">
                  We found {hotels.length} perfect hotels for you
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Image
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {hotel.rating ? hotel.rating.toFixed(1) : "4.5"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                        {hotel.highlights?.slice(0, 2).map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-background/90">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{hotel.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < (hotel.stars || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {hotel.stars || 0} stars
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {hotel.location}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      {hotel.whySuitable && (
                        <div className="mt-auto p-2 bg-primary/10 rounded-md">
                          <p className="text-xs font-medium text-primary mb-1">Why this hotel:</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{hotel.whySuitable}</p>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price per night</span>
                        <span className="text-lg font-bold text-primary">
                          {hotel.priceRange}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

