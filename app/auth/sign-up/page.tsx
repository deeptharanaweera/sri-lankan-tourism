import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://besttimetovisitsrilanka.com/wp-content/uploads/2021/04/Ella-Sightseeing-Tour-Sri-Lanka.jpg"
        alt="Ella Sri Lanka"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-sm z-10">
        <SignUpForm />
      </div>
    </div>
  );
}
