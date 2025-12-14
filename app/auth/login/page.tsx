import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images6.alphacoders.com/420/420230.jpg"
        alt="Sigiriya Rock Fortress"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-sm z-10">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
