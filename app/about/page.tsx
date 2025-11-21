import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Users, Award, Heart, MapPin, Mail, Phone, Globe } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Travelers", value: "10,000+" },
    { icon: Plane, label: "Tours Completed", value: "5,000+" },
    { icon: MapPin, label: "Destinations", value: "50+" },
    { icon: Award, label: "Years Experience", value: "10+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We're passionate about showing you the beauty of Sri Lanka and creating unforgettable memories.",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "We maintain the highest standards in our tours, accommodations, and customer service.",
    },
    {
      icon: Users,
      title: "Local Expertise",
      description: "Our team consists of local experts who know the best places and hidden gems.",
    },
    {
      icon: Globe,
      title: "Sustainable Tourism",
      description: "We're committed to sustainable tourism practices that benefit local communities.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner in discovering the wonders of Sri Lanka
            </p>
          </div>

          {/* Story Section */}
          <section className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, Sri Lanka Tourism has been dedicated to providing exceptional travel experiences
                  across the beautiful island nation. What started as a small local tour operator has grown into a
                  comprehensive tourism platform serving thousands of travelers from around the world.
                </p>
                <p>
                  We believe that travel should be accessible, authentic, and unforgettable. Our team of local experts,
                  travel enthusiasts, and technology innovators work together to create seamless experiences that combine
                  traditional hospitality with modern convenience.
                </p>
                <p>
                  With the integration of AI-powered trip planning and hotel suggestions, we're revolutionizing how
                  travelers discover and experience Sri Lanka. Our platform offers everything you need for a perfect
                  vacation - from curated tours and vehicle rentals to personalized itineraries and expert recommendations.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Stats Section */}
          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Values Section */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="text-muted-foreground">What drives us every day</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardHeader>
                      <Icon className="h-10 w-10 mb-4 text-primary" />
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Mission Section */}
          <section className="space-y-6">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="opacity-90">
                  To make Sri Lanka accessible to travelers worldwide by providing exceptional tours, reliable services,
                  and innovative technology that simplifies trip planning. We're committed to promoting sustainable
                  tourism that benefits local communities while creating unforgettable experiences for our guests.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact Info */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">We'd love to hear from you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg mb-2">Email</CardTitle>
                  <CardDescription>info@srilankatourism.com</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg mb-2">Phone</CardTitle>
                  <CardDescription>+94 11 234 5678</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg mb-2">Address</CardTitle>
                  <CardDescription>Colombo, Sri Lanka</CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

