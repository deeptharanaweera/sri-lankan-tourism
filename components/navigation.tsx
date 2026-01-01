"use client";

import { AdminLink } from "@/components/admin-link";
import { AuthButton } from "@/components/auth-button.client";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Car, Home, Image as ImageIcon, Info, Mail, Menu, MessageSquare, Plane, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tours", label: "Tours", icon: Plane },
  { href: "/vehicle-rental", label: "Vehicle Rental", icon: Car },
  { href: "/trip-planner", label: "AI Trip Planner", icon: Sparkles },
  { href: "/hotels", label: "Hotels", icon: Calendar },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="relative h-10 w-10 sm:h-[60px] sm:w-[60px]">
                  <Image src="/images/SriHeavenLankaIcon.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className=" sm:block text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Sri Heaven Lanka
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <span className="relative">
                      {item.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100",
                        isActive && "scale-x-100"
                      )} />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <ThemeSwitcher />
                <AdminLink />
                <AuthButton />
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-8 w-8" />
                ) : (
                  <Menu className="h-8 w-8" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              <div className="border-t pt-4 px-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeSwitcher />
                </div>
                <div className="flex flex-col gap-2">
                  <AdminLink />
                  <AuthButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}

