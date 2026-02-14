"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeartIntroProps {
    onComplete: () => void;
}

export default function HeartIntro({ onComplete }: HeartIntroProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 500);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Ripple rings */}
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full border-2 border-pink-500/30"
                            initial={{ width: 0, height: 0, opacity: 0.8 }}
                            animate={{
                                width: [0, 300, 500],
                                height: [0, 300, 500],
                                opacity: [0.8, 0.3, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.6,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                        />
                    ))}

                    {/* Main heart */}
                    <motion.div
                        className="relative z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.3, 1, 1.15, 1, 1.1, 1],
                            opacity: 1,
                        }}
                        transition={{
                            scale: {
                                duration: 2,
                                times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
                                ease: "easeInOut",
                            },
                            opacity: { duration: 0.3 },
                        }}
                    >
                        <span className="text-8xl md:text-9xl filter drop-shadow-[0_0_60px_rgba(236,72,153,0.8)]">
                            💖
                        </span>
                    </motion.div>

                    {/* Text below heart */}
                    <motion.p
                        className="absolute bottom-1/3 text-pink-300/80 text-lg md:text-xl tracking-[0.3em] uppercase font-light"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        Someone has a confession...
                    </motion.p>

                    {/* Sparkle particles */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={`sparkle-${i}`}
                            className="absolute w-1 h-1 rounded-full bg-pink-400"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                                y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                            }}
                            transition={{
                                duration: 1.5,
                                delay: 0.8 + i * 0.1,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
