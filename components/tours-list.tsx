"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TourItem } from "@/types/tour";
import { Clock, MapPin, Search, Star, Users } from "lucide-react";

interface ToursListProps {
  tours: TourItem[];
}

export function ToursList({ tours }: ToursListProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

              return (
                <Link key={tour.id} href={`/tours/${tour.id}`} className="block h-full">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full cursor-pointer group">
                    <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                      {tour.image_url ? (
                        <Image
                          src={tour.image_url}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {ratingValue > 0 ? ratingValue.toFixed(1) : "4.5"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2 overflow-hidden pr-4">
                        {highlights.slice(0, 3).map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="bg-background/90 whitespace-nowrap">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{tour.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {tour.description || "Experience the best of Sri Lanka with this curated package."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <div className="space-y-3 mt-auto">
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
                          <div className="text-2xl font-bold text-primary">
                            {priceNumber !== null && !Number.isNaN(priceNumber) ? `$${priceNumber.toFixed(2)}` : "Contact"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
    </div>
  );
}


