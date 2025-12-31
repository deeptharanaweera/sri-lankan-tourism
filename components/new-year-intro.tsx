"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// --- Assets ---
const img2025 = "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/65564eabecaa89001dc39525.jpg";
const img2026 = "https://www.lovesrilanka.org/wp-content/uploads/2020/04/LS_NineArches__Desktop_1920x700.jpg";

export function NewYearIntro({ onComplete }: { onComplete?: () => void }) {
    // Added 'exit' stage before 'finished'
    const [stage, setStage] = useState<"2025" | "transition" | "2026" | "exit" | "finished">("2025");

    useEffect(() => {
        // 1. Show 2025 (3s) -> Transition
        const timer1 = setTimeout(() => setStage("transition"), 3000);

        // 2. Horizon expansion (1.5s) -> 2026
        const timer2 = setTimeout(() => setStage("2026"), 4500);

        // 3. Show 2026 (4.5s) -> Start Exit Animation (Erase effect)
        const timer3 = setTimeout(() => setStage("exit"), 9000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    // If completely finished, unmount logic
    if (stage === "finished") return null;

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        visible: {
            clipPath: "inset(0% 0% 0% 0%)", // Fully visible
        },
        exit: {
            // The "Erase" Effect: Wipes the screen upward to reveal content underneath
            clipPath: "inset(0% 0% 100% 0%)",
            transition: {
                duration: 1.5,
                ease: [0.76, 0, 0.24, 1] as [number, number, number, number] // Dramatic ease-in-out
            }
        }
    };

    return (
        <motion.div
            key="overlay"
            initial="visible"
            animate={stage === "exit" ? "exit" : "visible"}
            variants={containerVariants}
            onAnimationComplete={(definition) => {
                // When the 'exit' animation finishes, remove component from DOM
                if (definition === "exit") {
                    setStage("finished");
                    if (onComplete) onComplete();
                }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            {/* --- BACKGROUND IMAGES --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/70 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />

                <motion.img
                    src={img2025}
                    alt="Heritage"
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{
                        opacity: stage === '2025' ? 1 : 0,
                        scale: stage === '2025' ? 1 : 1.1
                    }}
                    transition={{ duration: 2 }}
                />
                <motion.img
                    src={img2026}
                    alt="Journey"
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{
                        opacity: stage === '2026' || stage === 'exit' ? 1 : 0, // Keep visible during exit wipe
                        scale: stage === '2026' ? 1 : 1.1
                    }}
                    transition={{ duration: 2 }}
                />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* STAGE 1: 2025 */}
                    {stage === "2025" && (
                        <motion.div
                            key="2025"
                            initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)", transition: { duration: 1 } }}
                            className="text-center relative"
                        >
                            <h1 className="text-[15rem] md:text-[25rem] leading-none font-black text-white/10 tracking-tighter select-none">
                                2025
                            </h1>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-2xl md:text-4xl text-white/80 font-light tracking-[1em] uppercase">Closing Chapter</p>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 2 & 3: 2026 */}
                    {(stage === "transition" || stage === "2026" || stage === "exit") && (
                        <div className="relative flex flex-col items-center justify-center w-full">

                            {/* Horizon Line */}
                            <motion.div
                                className="absolute h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_100px_rgba(251,191,36,0.8)] z-30"
                                initial={{ width: 0 }}
                                animate={{ width: (stage === '2026' || stage === 'exit') ? "120%" : "0%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />

                            {(stage === "2026" || stage === "exit") && (
                                <motion.div className="relative text-center z-40 -mt-10" exit={{ opacity: 0 }}>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                        className="text-amber-300 tracking-[0.5em] text-lg md:text-xl uppercase font-medium mb-4"
                                    >
                                        Wonder of Asia
                                    </motion.p>

                                    <div className="relative overflow-hidden px-4 py-2">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-20 z-20"
                                            animate={{ x: ["-150%", "150%"] }}
                                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                                        />
                                        <motion.h1
                                            initial={{ y: "110%", opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
                                            className="text-9xl md:text-[13rem] leading-none font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-yellow-800 drop-shadow-2xl"
                                        >
                                            2026
                                        </motion.h1>
                                    </div>

                                    <motion.h2
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.2, type: "spring" }}
                                        className="mt-6 text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
                                    >
                                        HAPPY NEW YEAR
                                    </motion.h2>

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100px" }}
                                        transition={{ delay: 1.5, duration: 1 }}
                                        className="h-1 bg-teal-500 mx-auto mt-6"
                                    />
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}