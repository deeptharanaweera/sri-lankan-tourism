export interface TourItem {
    id: string;
    title: string;
    description: string | null;
    duration: string | null;
    price: number | string | null;
    location: string | null;
    max_group_size: number | null;
    rating: number | null;
    reviews_count: number | null;
    highlights: string[] | null;
    image_url: string | null;
    overview?: string | null;
    itinerary?: string | null; // JSON string or text
    includes?: string[] | null;
    excludes?: string[] | null;
    gallery_urls?: string[] | null;
    is_active?: boolean;
}
