import Image from "next/image";
import Link from "next/link";

import { HeroSlideshow } from "@/components/hero-slideshow";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRight, Binoculars, Car, Clock, Landmark, Mountain, Plane, Sparkles, Star, Umbrella, Users } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const [
    featuredToursResult,
    toursCountResult,
    galleryCountResult,
    vehiclesCountResult,
    reviewsCountResult,
    latestGalleryResult,
  ] = await Promise.all([
    supabase
      .from("tours")
      .select("id, title, description, duration, price, rating, highlights, image_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("tours").select("id", { count: "exact", head: true }),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", true),
    supabase
      .from("gallery")
      .select("id, title, location, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const featuredTours = featuredToursResult.data ?? [];
  const latestGalleryItems = latestGalleryResult.data ?? [];

  const stats = [
    { label: "Active Tours", value: toursCountResult.count ?? 0, icon: Plane },
    { label: "Gallery Items", value: galleryCountResult.count ?? 0, icon: Sparkles },
    { label: "Vehicles", value: vehiclesCountResult.count ?? 0, icon: Car },
    { label: "Approved Reviews", value: reviewsCountResult.count ?? 0, icon: Users },
  ];

  const experiences = [
    {
      icon: Landmark,
      title: "Cultural & Heritage Tours",
      description: "Journey through time as you explore the ancient cities of Anuradhapura and Polonnaruwa, climb the legendary Sigiriya Rock Fortress, and visit the sacred Temple of the Tooth.",
      linkText: "Explore History",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Binoculars,
      title: "Wildlife & Nature Safaris",
      description: "Embark on a thrilling safari in Yala National Park to spot elusive leopards, see vast herds of elephants in Udawalawe, and witness the majestic blue whales off the coast.",
      linkText: "Discover Wildlife",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: Mountain,
      title: "Hill Country & Tea Trails",
      description: "Experience the breathtaking beauty of the central highlands. Ride the scenic train to Ella, hike through lush green tea plantations in Nuwara Eliya, and discover misty waterfalls.",
      linkText: "See the Highlands",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Umbrella,
      title: "Beach & Coastal Relaxation",
      description: "Unwind on the pristine golden sands of Sri Lanka's southern coast. From the surf paradise of Arugam Bay to the tranquil shores of Bentota and the historic charm of Galle Fort.",
      linkText: "Find Your Beach",
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Trip Planner",
      description: "Generate personalized trip plans with AI assistance tailored to your preferences.",
    },
    {
      icon: Car,
      title: "Vehicle Rental",
      description: "Reliable vehicle rentals for your seamless journey across the island.",
    },
    {
      icon: Plane,
      title: "Tour Booking",
      description: "Book amazing tours guided by experienced local professionals.",
    },
    {
      icon: Star,
      title: "Hotel Suggestions",
      description: "Get smart AI-powered hotel recommendations for every destination.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <HeroSlideshow
          images={[
            "https://www.srilanka.org.tr/images/dataResim/9047ba-e_dyijlwyaajgd1.jpg?q=80&w=1600&auto=format&fit=crop",
            "https://i.ytimg.com/vi/FEAW5IbubXA/maxresdefault.jpg?q=80&w=1600&auto=format&fit=crop",
            "https://www.gokitetours.com/wp-content/uploads/2025/01/1.-Sigiriya-Rock-Fortress.webp?q=80&w=1600&auto=format&fit=crop",
          ]}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Discover the{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Pearl of the Indian Ocean
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the beauty, culture, and adventure of Sri Lanka with our curated tours and AI-powered travel planning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours">
                <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                  <Plane className="mr-2 h-5 w-5" />
                  Explore Tours
                </Button>
              </Link>
              <Link href="/trip-planner">
                <Button size="lg" variant="outline" className="text-lg px-8 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Plan Your Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-2 group">
                  <div className="h-12 w-12 mx-auto rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight">
                    {typeof stat.value === "number" ? stat.value : stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="h-px w-8 bg-primary"></span>
              Experiences
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Craft Your Perfect Sri Lankan Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Whether you seek ancient wonders, thrilling wildlife encounters, or tranquil beach escapes, we offer curated experiences to make your visit unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp) => {
              const Icon = exp.icon;
              return (
                <div key={exp.title} className="group flex flex-col sm:flex-row gap-6 p-8 rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className={`shrink-0 h-16 w-16 rounded-full ${exp.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${exp.color}`} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{exp.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                    <Link href="/tours" className={`inline-flex items-center text-sm font-medium ${exp.color} hover:underline`}>
                      {exp.linkText}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for an unforgettable Sri Lankan adventure, powered by modern technology and local expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Tours</h2>
              <p className="text-muted-foreground">Handpicked experiences for your perfect getaway</p>
            </div>
            {featuredTours.length > 0 && (
              <Link href="/tours">
                <Button variant="outline">View All</Button>
              </Link>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.length > 0 ? (
              featuredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={
                        tour.image_url ||
                        "https://images.unsplash.com/photo-1586516483559-326727195a1b?q=80&w=1600&auto=format&fit=crop"
                      }
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 z-10">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {tour.rating ? Number(tour.rating).toFixed(1) : "4.5"}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{tour.title}</CardTitle>
                    <CardDescription>
                      {tour.description || "Experience the best of Sri Lanka with this curated tour."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {tour.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tour.duration}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold">
                        {tour.price ? `$${Number(tour.price).toFixed(2)}` : "Contact"}
                      </div>
                    </div>
                    <Link href="/tours" className="block mt-4">
                      <Button className="w-full">Book Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No tours available yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Adventure?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Let our AI-powered trip planner create the perfect itinerary for you
              </p>
              <Link href="/trip-planner">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your Trip Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {latestGalleryItems.length > 0 && (
        <section className="py-20 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Latest Moments</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Glimpses from our newest adventures across Sri Lanka — refreshed as we capture them.
                </p>
              </div>
              <Link href="/gallery" className="self-start md:self-end">
                <Button variant="outline">View Full Gallery</Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestGalleryItems.map((item) => {
                const imageSrc =
                  item.image_url ||
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";
                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageSrc}
                        alt={item.title ?? "Sri Lanka tour gallery image"}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 space-y-1 text-primary-foreground">
                        <p className="text-lg font-semibold line-clamp-2">
                          {item.title ?? "Sri Lanka Adventure"}
                        </p>
                        {item.location && <p className="text-sm opacity-80">{item.location}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sri Lanka Tourism</h3>
              <p className="text-muted-foreground text-sm">
                Your gateway to experiencing the beauty and culture of Sri Lanka
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tours" className="hover:text-foreground">Tours</Link></li>
                <li><Link href="/vehicle-rental" className="hover:text-foreground">Vehicle Rental</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/trip-planner" className="hover:text-foreground">Trip Planner</Link></li>
                <li><Link href="/hotels" className="hover:text-foreground">Hotels</Link></li>
                <li><Link href="/reviews" className="hover:text-foreground">Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Sri Lanka Tourism. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
