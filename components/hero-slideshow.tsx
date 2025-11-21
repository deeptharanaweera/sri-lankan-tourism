"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type HeroSlideshowProps = {
  images: Array<string>;
  interval?: number;
  className?: string;
};

export function HeroSlideshow({ images, interval = 6000, className }: HeroSlideshowProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = safeImages.length;

  useEffect(() => {
    if (imageCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageCount);
    }, interval);

    return () => window.clearInterval(timer);
  }, [imageCount, interval]);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageCount]);

  if (imageCount === 0) {
    return null;
  }

  return (
    <div aria-hidden className={cn("absolute inset-0 pointer-events-none", className)}>
      {safeImages.map((image, index) => (
        <div
          key={image}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={image}
            alt=""
            fill
            priority={index === 0}
            placeholder="empty"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/60 to-secondary/40" />
    </div>
  );
}

