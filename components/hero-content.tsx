"use client";

import { motion } from "framer-motion";
import { Plane, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroContent() {
    return (
        <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center justify-center min-h-[95vh]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-8 max-w-4xl p-8 md:p-12 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl"
            >
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg"
                >
                    Discover the{" "}
                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-300 drop-shadow-none">
                        Pearl of the Indian Ocean
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-zinc-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium"
                >
                    Experience the beauty, culture, and adventure of Sri Lanka with our curated tours and AI-powered travel planning.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center pt-4"
                >
                    <Link href="/tours">
                        <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1">
                            <Plane className="mr-3 h-6 w-6" />
                            Explore Tours
                        </Button>
                    </Link>
                    <Link href="/trip-planner">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto text-lg px-8 py-7 backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
                        >
                            <Sparkles className="mr-3 h-6 w-6" />
                            Plan Your Trip
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
