import { GalleryForm } from "@/components/gallery-form";

export default function AddGalleryPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <GalleryForm mode="create" />
    </div>
  );
}
