"use client";

import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Image as ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";

interface GalleryListProps {
  items: GalleryItem[];
}

interface GalleryItem {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  date_taken: string | null;
  image_url: string;
  description: string | null;
  is_featured: boolean;
}

export function GalleryList({ items }: GalleryListProps) {
  const categories = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        unique.add(item.category.toLowerCase());
      }
    });
    return ["all", ...Array.from(unique)];
  }, [items]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category?.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Tour Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore beautiful moments from our past tours and discover the wonders of Sri Lanka
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="relative h-64 w-full bg-muted overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    {item.is_featured && (
                      <Badge variant="secondary" className="bg-white/80 text-black">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      )}
                      {item.date_taken && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date_taken).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


