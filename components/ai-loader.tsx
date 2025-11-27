"use client";

import { motion } from "framer-motion";
import { Brain, Map, Sparkles } from "lucide-react";

export function AILoader() {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative h-32 w-32 flex items-center justify-center">
                {/* Pulsing background rings */}
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.6,
                            ease: "easeOut",
                        }}
                    />
                ))}

                {/* Central Brain Icon */}
                <motion.div
                    className="relative z-10 bg-background p-4 rounded-full shadow-xl border border-primary/20"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Brain className="h-12 w-12 text-primary" />
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background p-2 rounded-full shadow-sm border border-border"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <Map className="h-4 w-4 text-green-600" />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute top-1/2 -right-6 -translate-y-1/2 bg-background p-2 rounded-full shadow-sm border border-border"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                </motion.div>
            </div>

            <div className="text-center space-y-2">
                <motion.h3
                    className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Designing Your Adventure
                </motion.h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                    Analyzing preferences, checking routes, and finding the best spots in Sri Lanka...
                </p>
            </div>
        </div>
    );
}
