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
  gallery_images?: {
    id: string;
    image_url: string;
  }[];
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category?.toLowerCase() === selectedCategory);

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const allImages = useMemo(() => {
    if (!selectedItem) return [];
    const images = [selectedItem.image_url];
    if (selectedItem.gallery_images && selectedItem.gallery_images.length > 0) {
      images.push(...selectedItem.gallery_images.map(img => img.image_url));
    }
    return images;
  }, [selectedItem]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
                onClick={() => handleItemClick(item)}
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
                  {item.gallery_images && item.gallery_images.length > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/60 text-white border-none">
                        +{item.gallery_images.length} more
                      </Badge>
                    </div>
                  )}
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

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-none text-white">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
              {/* Image Section */}
              <div className="relative flex-1 bg-black flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-80 p-6 flex flex-col gap-4 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  {selectedItem.category && (
                    <Badge variant="outline" className="mt-2 border-zinc-700 text-zinc-300">
                      {selectedItem.category}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4 text-zinc-300">
                  {selectedItem.description && (
                    <p className="text-sm leading-relaxed">{selectedItem.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-zinc-400">
                    {selectedItem.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedItem.location}</span>
                      </div>
                    )}
                    {selectedItem.date_taken && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedItem.date_taken).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="mt-auto pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-2">Gallery Images</p>
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${currentImageIndex === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          onClick={() => setCurrentImageIndex(idx)}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


