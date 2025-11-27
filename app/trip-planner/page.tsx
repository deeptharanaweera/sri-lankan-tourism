"use client";

import { AILoader } from "@/components/ai-loader";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, DollarSign, Hotel, Loader2, MapPin, Sparkles, Star, Users, Utensils } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const tripPlanSchema = z.object({
  duration: z.string().min(1, "Duration is required"),
  budget: z.string().min(1, "Budget is required"),
  travelers: z.string().min(1, "Number of travelers is required"),
  interests: z.string().min(1, "Please describe your interests"),
  preferredLocations: z.string().optional(),
});

type TripPlanForm = z.infer<typeof tripPlanSchema>;

interface Activity {
  time: string;
  activity: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
}

interface Day {
  day: number;
  date: string;
  title: string;
  locations: string[];
  activities: Activity[];
  accommodation: string;
  meals: string[];
  tips: string;
}

interface Destination {
  name: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  estimatedCost: string;
  imageUrl?: string;
}

interface Accommodation {
  name: string;
  type: string;
  location: string;
  priceRange: string;
  description: string;
  amenities: string[];
  imageUrl?: string;
}

interface StructuredTripPlan {
  title: string;
  summary: string;
  days: Day[];
  destinations: Destination[];
  accommodations: Accommodation[];
  transportation: string;
  totalEstimatedCost: string;
  tips: string[];
  culturalEtiquette: string;
}

export default function TripPlannerPage() {
  const [plan, setPlan] = useState<string>("");
  const [structuredPlan, setStructuredPlan] = useState<StructuredTripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const structuredPlanRef = useRef<HTMLDivElement>(null);
  const simplePlanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (structuredPlan || plan)) {
      // Small timeout to ensure DOM is updated
      const timer = setTimeout(() => {
        if (structuredPlan && structuredPlanRef.current) {
          structuredPlanRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (plan && simplePlanRef.current) {
          simplePlanRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, structuredPlan, plan]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripPlanForm>({
    resolver: zodResolver(tripPlanSchema),
  });

  const onSubmit = async (data: TripPlanForm) => {
    setLoading(true);
    setPlan("");
    setStructuredPlan(null);

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate trip plan");
      }

      const result = await response.json();
      if (result.structuredPlan) {
        setStructuredPlan(result.structuredPlan);
      } else if (result.plan) {
        setPlan(result.plan);
      } else {
        setPlan("Sorry, there was an error generating your trip plan. Please try again.");
      }
    } catch (error) {
      console.error("Error generating trip plan:", error);
      setPlan("Sorry, there was an error generating your trip plan. Please try again.");
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
              <Sparkles className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">AI Trip Planner</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us about your preferences and let AI create a personalized trip plan for your Sri Lankan adventure
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Tell Us About Your Trip</CardTitle>
                <CardDescription>
                  Fill in the details below to generate your personalized itinerary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Trip Duration
                    </Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 5 days, 1 week, 10 days"
                      {...register("duration")}
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive">{errors.duration.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">
                      <DollarSign className="inline h-4 w-4 mr-2" />
                      Budget Range
                    </Label>
                    <Input
                      id="budget"
                      placeholder="e.g., $500-$1000, Budget-friendly, Luxury"
                      {...register("budget")}
                    />
                    {errors.budget && (
                      <p className="text-sm text-destructive">{errors.budget.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelers">
                      <Users className="inline h-4 w-4 mr-2" />
                      Number of Travelers
                    </Label>
                    <Input
                      id="travelers"
                      placeholder="e.g., 2 people, Family of 4, Solo"
                      {...register("travelers")}
                    />
                    {errors.travelers && (
                      <p className="text-sm text-destructive">{errors.travelers.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredLocations">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Preferred Locations (Optional)
                    </Label>
                    <Input
                      id="preferredLocations"
                      placeholder="e.g., Kandy, Galle, Nuwara Eliya"
                      {...register("preferredLocations")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests & Preferences</Label>
                    <textarea
                      id="interests"
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Describe your interests: e.g., beaches, culture, wildlife, adventure, relaxation, photography..."
                      {...register("interests")}
                    />
                    {errors.interests && (
                      <p className="text-sm text-destructive">{errors.interests.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Trip Plan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results - Side by side when no plan, full width when plan is shown */}
            {!structuredPlan ? (
              <Card ref={simplePlanRef} className="relative overflow-hidden min-h-[400px] flex flex-col">
                {/* Background Image for Empty State */}
                {!loading && !plan && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/trip-planner-bg.png"
                      alt="Sri Lanka Scenery"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </div>
                )}

                <CardHeader className="relative z-10">
                  
                </CardHeader>
                <CardContent className="relative z-10 flex-grow flex flex-col justify-center">
                  {loading ? (
                    <AILoader />
                  ) : plan ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap text-sm">{plan}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-white">
                      <Sparkles className="h-16 w-16 mx-auto mb-6 opacity-80" />
                      <h3 className="text-2xl font-semibold mb-2">Ready to Explore?</h3>
                      <p className="text-lg opacity-90">Fill in the form and click "Generate Trip Plan" to start your Sri Lankan adventure.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Structured Trip Plan - Full width when plan is available */}
          {structuredPlan && (
            <div ref={structuredPlanRef} className="space-y-8">
              {/* Trip Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">{structuredPlan.title}</CardTitle>
                  <CardDescription className="text-base">{structuredPlan.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Total Estimated Cost:</span>
                      <span>{structuredPlan.totalEstimatedCost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Duration:</span>
                      <span>{structuredPlan.days?.length || 0} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Destinations */}
              {structuredPlan.destinations && structuredPlan.destinations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Destinations</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {structuredPlan.destinations.map((destination, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {destination.imageUrl && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={destination.imageUrl}
                              alt={destination.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20" />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{destination.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {destination.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {destination.highlights && destination.highlights.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {destination.highlights.map((highlight, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Best time: {destination.bestTimeToVisit}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>Est. cost: {destination.estimatedCost}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations */}
              {structuredPlan.accommodations && structuredPlan.accommodations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Accommodations</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {structuredPlan.accommodations.map((accommodation, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {accommodation.imageUrl && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={accommodation.imageUrl}
                              alt={accommodation.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20" />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{accommodation.name}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-1 text-sm mt-1">
                              <MapPin className="h-3 w-3" />
                              {accommodation.location}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {accommodation.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{accommodation.type}</Badge>
                              <span className="text-sm font-semibold text-primary">
                                {accommodation.priceRange}
                              </span>
                            </div>
                            {accommodation.amenities && accommodation.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {accommodation.amenities.map((amenity, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Itinerary */}
              {structuredPlan.days && structuredPlan.days.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Day-by-Day Itinerary</h2>
                  <div className="space-y-6">
                    {structuredPlan.days.map((day, dayIndex) => (
                      <Card key={dayIndex}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                {day.date} - {day.title}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {day.locations?.map((loc, idx) => (
                                    <Badge key={idx} variant="secondary">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {loc}
                                    </Badge>
                                  ))}
                                </div>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {day.activities && day.activities.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold">Activities</h4>
                              {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="border-l-2 border-primary pl-4 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{activity.time}</span>
                                    <span className="text-sm text-muted-foreground">
                                      ({activity.duration})
                                    </span>
                                  </div>
                                  <h5 className="font-semibold">{activity.activity}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {activity.location}
                                    </span>
                                    {activity.cost && (
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {activity.cost}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                              <Hotel className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                <span className="font-semibold">Accommodation:</span> {day.accommodation}
                              </span>
                            </div>
                          )}
                          {day.meals && day.meals.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <Utensils className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">Meals:</span>
                              {day.meals.map((meal, idx) => (
                                <Badge key={idx} variant="outline">
                                  {meal}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {day.tips && (
                            <div className="p-3 bg-primary/10 rounded-md">
                              <p className="text-sm">
                                <span className="font-semibold">💡 Tip:</span> {day.tips}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {structuredPlan.transportation && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transportation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {structuredPlan.transportation}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {structuredPlan.culturalEtiquette && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Cultural Etiquette</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {structuredPlan.culturalEtiquette}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tips */}
              {structuredPlan.tips && structuredPlan.tips.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {structuredPlan.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

