"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ConfessionCardProps {
    message: string;
    views: number;
    likes: number;
    confessionId: string;
    theme: "romantic" | "minimal" | "aesthetic";
}

export default function ConfessionCard({
    message,
    views,
    likes: initialLikes,
    confessionId,
    theme,
}: ConfessionCardProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [showLoveMsg, setShowLoveMsg] = useState(false);
    const [burstHearts, setBurstHearts] = useState<number[]>([]);

    const themeStyles = {
        romantic: {
            card: "bg-gradient-to-br from-pink-950/60 via-rose-950/40 to-red-950/60 border-pink-500/20",
            text: "text-pink-100",
            accent: "from-pink-500 to-rose-600",
            glow: "shadow-[0_0_80px_rgba(236,72,153,0.15)]",
        },
        minimal: {
            card: "bg-zinc-900/80 border-zinc-700/30",
            text: "text-zinc-100",
            accent: "from-zinc-400 to-zinc-500",
            glow: "shadow-[0_0_60px_rgba(161,161,170,0.1)]",
        },
        aesthetic: {
            card: "bg-gradient-to-br from-purple-950/60 via-fuchsia-950/40 to-violet-950/60 border-purple-500/20",
            text: "text-purple-100",
            accent: "from-purple-400 to-fuchsia-500",
            glow: "shadow-[0_0_80px_rgba(168,85,247,0.15)]",
        },
    };

    const style = themeStyles[theme];

    const handleLike = async () => {
        if (liked) return;

        try {
            const res = await fetch(`/api/confessions/${confessionId}/like`, {
                method: "POST",
            });
            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                setLiked(true);
                setShowLoveMsg(true);

                // Create burst hearts
                const newHearts = Array.from({ length: 8 }, (_, i) => Date.now() + i);
                setBurstHearts(newHearts);

                setTimeout(() => setShowLoveMsg(false), 3000);
                setTimeout(() => setBurstHearts([]), 2000);
            }
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    return (
        <motion.div
            className="relative w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Burst hearts animation */}
            {burstHearts.map((id, i) => (
                <motion.span
                    key={id}
                    className="absolute text-2xl pointer-events-none z-20"
                    style={{ left: "50%", top: "50%" }}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{
                        opacity: 0,
                        scale: 1.5,
                        x: Math.cos((i * 45 * Math.PI) / 180) * 120,
                        y: Math.sin((i * 45 * Math.PI) / 180) * 120 - 40,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    💕
                </motion.span>
            ))}

            <div
                className={`relative rounded-2xl border ${style.card} ${style.glow} backdrop-blur-xl p-8 md:p-10`}
            >
                {/* Decorative top accent */}
                <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r ${style.accent} opacity-60`}
                />

                {/* Quote icon */}
                <motion.div
                    className="text-pink-500/20 text-6xl font-serif leading-none mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    &ldquo;
                </motion.div>

                {/* Message with fade-in effect */}
                <motion.p
                    className={`text-lg md:text-xl leading-relaxed ${style.text} font-light`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                >
                    {message}
                </motion.p>

                <motion.div
                    className="text-pink-500/20 text-6xl font-serif leading-none mt-4 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    &rdquo;
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex items-center justify-between mt-8 pt-6 border-t border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <span className="flex items-center gap-1.5">
                            <span>❤️</span> {likes} {likes === 1 ? "like" : "likes"}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span>👀</span> {views} {views === 1 ? "view" : "views"}
                        </span>
                    </div>
                </motion.div>

                {/* Like button */}
                <motion.div
                    className="mt-6 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.button
                        onClick={handleLike}
                        disabled={liked}
                        className={`
              relative px-8 py-3 rounded-full text-sm font-medium tracking-wide
              transition-all duration-300 overflow-hidden
              ${liked
                                ? "bg-pink-500/20 text-pink-300 cursor-default"
                                : "bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-500 hover:to-rose-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] active:scale-95"
                            }
            `}
                        whileHover={!liked ? { scale: 1.05 } : {}}
                        whileTap={!liked ? { scale: 0.95 } : {}}
                    >
                        {liked ? "You sent love 💖" : "Send Love ❤️"}
                    </motion.button>

                    {/* Love message animation */}
                    {showLoveMsg && (
                        <motion.p
                            className="text-pink-400/80 text-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Someone felt this ❤️
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
