"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
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

export default function ContactPage() {
  const supabase = createClient();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.from("contacts").insert([
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      },
    ]);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message = "Unable to submit the form due to permissions. Please contact support.";
      }
      setErrorMessage(message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["info@srilankatourism.com", "support@srilankatourism.com"],
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+94 11 234 5678", "+94 77 123 4567"],
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["123 Tourism Street, Colombo 05", "Sri Lanka"],
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 1:00 PM"],
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <Image
            src="https://media.licdn.com/dms/image/v2/D5612AQHNEh2Xsr1ZiQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1728371559605?e=2147483647&v=beta&t=qI3tnEmXbZj34YSw0Zx4LwB2oK_dLKBaE28gfj1Us70"
            alt="Sri Lanka Support"
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
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-yello-400" />
              <span>We&apos;re here to help</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
              Have questions about your next adventure? Our team is ready to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6"
            >
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} variants={fadeIn} custom={index}>
                    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${item.bg} text-primary shrink-0`}>
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <div className="text-muted-foreground text-sm space-y-1">
                            {item.details.map((detail, i) => (
                              <p key={i}>{detail}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-primary"></div>
              <CardHeader className="bg-muted/30 pb-8">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="h-24 w-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Send className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Message Sent Successfully!</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Thank you for reaching out. Our team will review your message and respond within 24 hours.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-11 bg-muted/20 focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">Email Address <span className="text-destructive">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="e.g. john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-11 bg-muted/20 focus:bg-background transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="e.g. +1 234 567 890"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-11 bg-muted/20 focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-base">Subject <span className="text-destructive">*</span></Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="h-11 bg-muted/20 focus:bg-background transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base">Message <span className="text-destructive">*</span></Label>
                      <textarea
                        id="message"
                        name="message"
                        className="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px] bg-muted/20 focus:bg-background transition-colors resize-y"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium"
                      >
                        {errorMessage}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full text-lg h-12"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Map Section or Placeholder */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Visit Our Headquarters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Located in the heart of Colombo, our office is open for walk-in consultations to plan your perfect Sri Lankan getaway.
          </p>
          <div className="w-full h-[400px] bg-muted rounded-3xl relative overflow-hidden flex items-center justify-center border shadow-inner">
            <Image
              src="https://images.unsplash.com/photo-1548232979-6c557ee14752?q=80&w=2071&auto=format&fit=crop"
              alt="Map Location Placeholder"
              fill
              className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <a
              href="https://maps.google.com/?q=Colombo,Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="z-10 bg-background/90 backdrop-blur px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <MapPin className="text-red-500" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
