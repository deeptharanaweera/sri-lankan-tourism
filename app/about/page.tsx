"use client";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const stats = [
    { icon: Users, label: "Happy Travelers", value: "10,000+", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Plane, label: "Tours Completed", value: "5,000+", color: "text-sky-500", bg: "bg-sky-50" },
    { icon: MapPin, label: "Destinations", value: "50+", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Award, label: "Years Experience", value: "10+", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We're passionate about showing you the beauty of Sri Lanka and creating unforgettable memories.",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      icon: ShieldCheck,
      title: "Quality Service",
      description: "We maintain the highest standards in our tours, accommodations, and customer service.",
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      icon: Users,
      title: "Local Expertise",
      description: "Our team consists of local experts who know the best places and hidden gems.",
      color: "text-violet-500",
      bg: "bg-violet-50"
    },
    {
      icon: Leaf,
      title: "Sustainable Tourism",
      description: "We're committed to sustainable tourism practices that benefit local communities.",
      color: "text-green-500",
      bg: "bg-green-50"
    },
  ];



  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <Image
            src="/images/about_bg.jpg"
            alt="Sri Lanka Scenery"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </motion.div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <Badge className="bg-primary/20 hover:bg-primary/30 text-white backdrop-blur-md border-primary/50 text-base py-1 px-4 rounded-full">
              Established 2015
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover the <span className="text-primary-foreground text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Wonder</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              Your trusted partner in crafting unforgettable journeys across the pearl of the Indian Ocean.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={fadeIn} custom={index}>
                  <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-none h-full bg-card/95 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-6 flex flex-col items-center">
                      <div className={`h-16 w-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="text-4xl font-bold mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-blue-600 font-semibold tracking-wide uppercase mb-2">Our Story</h2>
                <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                  From Local Passion to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global Connection</span>
                </h3>
              </div>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2015, Sri Heaven Lanka started with a simple belief: that travel should be more than just visiting places; it should be about connecting with the soul of a destination.
                </p>
                <p>
                  What began as a small team of travel enthusiasts has grown into a comprehensive platform that combines traditional Sri Lankan hospitality with cutting-edge technology. We&apos;ve helped thousands of travelers discover the hidden waterfalls of Ella, the ancient ruins of Polonnaruwa, and the pristine beaches of Mirissa.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background break-inside-avoid overflow-hidden bg-gray-100">
                        <Image
                          src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                          width={48}
                          height={48}
                          alt="Traveler"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium">
                    <span className="block text-foreground font-bold text-lg">10k+</span>
                    Happy Travelers
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://d1bv4heaa2n05k.cloudfront.net/user-images/1530794516017/shutterstock-470724314_main_1530794571986.jpeg"
                  alt="Sri Lankan Culture"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-lg font-medium italic">&quot;Travel is the only thing you buy that makes you richer.&quot;</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that drive every decision we make and every tour we plan.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-none bg-card group overflow-hidden">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                      <div className={`h-12 w-12 rounded-xl ${value.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <CardTitle className="text-xl pt-2">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-[5.5rem]">
                      <CardDescription className="text-base leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                    <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent to-${value.color.split('-')[1]}-500/50`} />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0">
          <Image
            src="https://images.unsplash.com/photo-1590606776856-42ab74291079?q=80&w=2000&auto=format&fit=crop"
            alt="Sigiriya"
            fill
            className="object-cover opacity-10 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-primary/90" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Sparkles className="w-12 h-12 mx-auto text-yellow-300 mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold">Our Mission</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90">
              &quot;To make Sri Lanka accessible to travelers worldwide by providing exceptional tours, reliable services, and innovative technology that simplifies trip planning.&quot;
            </p>
            <div className="pt-8">
              <Button size="lg" variant="secondary" className="text-lg px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Join Our Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">Have questions? We&apos;re here to help.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-8 text-center border shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-14 w-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-6 text-blue-600">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">For booking inquiries and support</p>
              <a href="mailto:info@srilankatourism.com" className="text-blue-600 font-medium hover:underline">info@srilankatourism.com</a>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-8 text-center border shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-14 w-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">Mon-Fri from 8am to 5pm</p>
              <a href="tel:+94112345678" className="text-green-600 font-medium hover:underline">+94 11 234 5678</a>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-8 text-center border shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-14 w-14 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-6 text-purple-600">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-4">Come say hello at our office</p>
              <span className="text-purple-600 font-medium">Colombo, Sri Lanka</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
