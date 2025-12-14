"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type HeroSlide = {
  image: string;
  title: string;
  subtitle?: string;
  location?: string;
};

type HeroSlideshowProps = {
  items: Array<HeroSlide>;
  interval?: number;
  className?: string;
};

export function HeroSlideshow({ items, interval = 6000, className }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items.length) return null;

  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={items[activeIndex].image}
            alt={items[activeIndex].title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for text readability */}
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="absolute bottom-10 left-0 w-full z-20 pointer-events-none"> {/* lowered position */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl text-white"
            >
              {items[activeIndex].location && (
                <div className="flex items-center gap-2 mb-2 text-white/80 font-medium tracking-wide text-sm uppercase">
                  <MapPin className="h-4 w-4" />
                  {items[activeIndex].location}
                </div>
              )}
              <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight drop-shadow-md">
                {items[activeIndex].title}
              </h2>
              {items[activeIndex].subtitle && (
                <p className="text-lg md:text-xl text-white/90 font-light drop-shadow-sm">
                  {items[activeIndex].subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress / Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3 pointer-events-auto">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />
    </div>
  );
}

