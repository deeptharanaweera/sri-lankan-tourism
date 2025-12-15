"use client";

import { motion, UseInViewOptions, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type ScrollAnimationProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "fade-left" | "fade-right" | "zoom-in" | "scale-up";
    delay?: number;
    duration?: number;
    viewport?: UseInViewOptions;
    as?: React.ElementType;
};

export function ScrollAnimation({
    children,
    className,
    variant = "default",
    delay = 0,
    duration = 0.5,
    viewport = { once: false, amount: 0.2 },
    as: Component = motion.div,
}: ScrollAnimationProps) {

    const variants: Record<string, Variants> = {
        default: {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        },
        "fade-left": {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 },
        },
        "fade-right": {
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0 },
        },
        "zoom-in": {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.8, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0 },
        }
    };

    const selectedVariant = variants[variant] || variants.default;

    return (
        <Component
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration, delay, ease: "easeOut" }}
            variants={selectedVariant}
            className={cn(className)}
        >
            {children}
        </Component>
    );
}
