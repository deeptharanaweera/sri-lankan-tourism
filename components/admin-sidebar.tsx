"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Car,
  Image,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Plane,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Tours",
    href: "/admin/tours",
    icon: Plane,
  },
  {
    title: "Manage Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Manage Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Manage Vehicles",
    href: "/admin/vehicles",
    icon: Car,
  },
  {
    title: "Manage Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Contact Messages",
    href: "/admin/contacts",
    icon: Mail,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-[#0f172a] text-slate-100 border-r border-slate-800 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b border-slate-800 px-6">
            <div className="flex items-center gap-2 text-white">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-xl tracking-tight">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 mb-1 font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 border-r-4 border-blue-500 rounded-r-none rounded-l-md"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-blue-400")} />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}


