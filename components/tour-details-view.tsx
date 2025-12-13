"use client";

import { Check, Clock, MapPin, Star, Users, X as XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { TourBookingDialog } from "@/components/tour-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TourItem } from "@/types/tour";

interface TourDetailsViewProps {
    tour: TourItem;
}

export function TourDetailsView({ tour }: TourDetailsViewProps) {
    const [bookingOpen, setBookingOpen] = useState(false);

    // Mock data generation if fields are missing
    const itinerary = tour.itinerary
        ? JSON.parse(tour.itinerary)
        : [
            { day: 1, title: "Arrival & Welcome", description: "Arrive at the airport and transfer to your hotel. Welcome dinner." },
            { day: 2, title: "City Tour", description: "Explore the main attractions of the city including historical sites and markets." },
            { day: 3, title: "Nature & Adventure", description: "Visit the national park for a safari or hike through the scenic trails." },
            { day: 4, title: "Cultural Experience", description: "Visit ancient temples and experience traditional cultural performances." },
            { day: 5, title: "Relaxation", description: "Leisure time at the beach or spa before departure." },
        ];

    const includes = tour.includes?.length
        ? tour.includes
        : ["Accommodation in 4/5 star hotels", "Daily Breakfast and Dinner", "English speaking guide", "Transportation in AC vehicle", "Entrance fees to all sites"];

    const excludes = tour.excludes?.length
        ? tour.excludes
        : ["International flights", "Visa fees", "Personal expenses", "Tips and gratuities", "Optional activities"];

    const gallery = tour.gallery_urls?.length
        ? tour.gallery_urls
        : [tour.image_url, "https://images.unsplash.com/photo-1586516483559-326727195a1b?q=80&w=1600", "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600", "https://images.unsplash.com/photo-1546708773-e529a69cd31e?q=80&w=1600"].filter(Boolean) as string[];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Left Column - Images */}
                <div className="space-y-4">
                    <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
                        {tour.image_url ? (
                            <Image
                                src={tour.image_url}
                                alt={tour.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <Badge className="text-lg py-1 px-3 bg-primary text-primary-foreground">
                                Best Seller
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {gallery.slice(1, 4).map((img, idx) => (
                            <div key={idx} className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current opacity-50" />
                            </div>
                            <span className="text-muted-foreground text-sm">({tour.reviews_count || 46} Reviews)</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">{tour.title}</h1>
                        <div className="text-3xl font-bold text-primary mt-4">
                            From ${Number(tour.price).toFixed(2)}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {tour.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 p-6 bg-muted/30 rounded-xl border">
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-900 block">Duration</span>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="w-4 h-4 mr-2" />
                                {tour.duration}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-900 block">Group Size</span>
                            <div className="flex items-center text-muted-foreground">
                                <Users className="w-4 h-4 mr-2" />
                                Max {tour.max_group_size}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-900 block">Location</span>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                {tour.location}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-900 block">Trip Type</span>
                            <div className="text-muted-foreground">
                                {tour.highlights?.[0] || "Cultural & Scenic"}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="flex-1 text-lg h-12" onClick={() => setBookingOpen(true)}>
                            Book Now
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1 text-lg h-12">
                            Trip Enquiry
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg text-blue-700">
                        <Check className="w-4 h-4" />
                        <span>Free cancellation up to 24 hours before the trip start date.</span>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-16">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none overflow-x-auto flex-nowrap">
                        {["Overview", "Itinerary", "Trip Includes", "Trip Excludes", "Gallery", "Reviews"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab.toLowerCase().replace(" ", "-")}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-base font-medium"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mt-8">
                        <TabsContent value="overview" className="space-y-6">
                            <h3 className="text-2xl font-bold">Tour Overview</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {tour.overview || tour.description || "Join us on this incredible journey through the heart of Sri Lanka. Experience the perfect blend of culture, nature, and relaxation as we take you to the most iconic destinations in the island."}
                            </p>

                            <div className="mt-8">
                                <h4 className="text-xl font-semibold mb-4">Highlights</h4>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {tour.highlights?.map((highlight, i) => (
                                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="itinerary" className="space-y-8">
                            <h3 className="text-2xl font-bold mb-6">Daily Itinerary</h3>
                            <div className="space-y-8">
                                {itinerary.map((day: { day: number; title: string; description: string }, index: number) => (
                                    <div key={index} className="flex gap-6 relative">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold z-10">
                                                {day.day || index + 1}
                                            </div>
                                            {index !== itinerary.length - 1 && (
                                                <div className="w-0.5 h-full bg-border absolute top-12 bottom-[-32px] left-6" />
                                            )}
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-xl font-bold mb-2">{day.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed">{day.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="trip-includes">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-2xl font-bold mb-6">What&apos;s Included</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {includes.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="trip-excludes">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-2xl font-bold mb-6">What&apos;s Excluded</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {excludes.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <XIcon className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="gallery">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {gallery.map((img, i) => (
                                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                                        <Image src={img} alt="Gallery" fill className="object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-8 p-6 bg-muted/30 rounded-xl">
                                    <div className="text-5xl font-bold text-primary">{tour.rating?.toFixed(1) || "4.5"}</div>
                                    <div className="space-y-1">
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-5 h-5 ${s <= Math.round(tour.rating || 4.5) ? "fill-current" : "opacity-30"}`} />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground">Based on {tour.reviews_count || 46} reviews</p>
                                    </div>
                                </div>
                                {/* Mock Reviews */}
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b pb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-semibold">John Doe</div>
                                            <div className="text-sm text-muted-foreground">2 days ago</div>
                                        </div>
                                        <div className="flex text-yellow-500 w-3 h-3 mb-2">
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                        <p className="text-muted-foreground mt-2">
                                            Amazing experience! The guide was very knowledgeable and the locations were breathtaking. distinctio.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            <TourBookingDialog
                tour={tour}
                open={bookingOpen}
                onOpenChange={setBookingOpen}
            />
        </div>
    );
}
