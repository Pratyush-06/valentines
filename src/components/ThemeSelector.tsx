"use client";

import { motion } from "framer-motion";

interface ThemeSelectorProps {
    theme: "romantic" | "minimal" | "aesthetic";
    onChange: (theme: "romantic" | "minimal" | "aesthetic") => void;
}

const themes = [
    {
        id: "romantic" as const,
        label: "Romantic",
        emoji: "🌹",
        color: "from-pink-600 to-rose-600",
        borderColor: "border-pink-500/50",
    },
    {
        id: "minimal" as const,
        label: "Minimal",
        emoji: "✨",
        color: "from-zinc-400 to-zinc-500",
        borderColor: "border-zinc-500/50",
    },
    {
        id: "aesthetic" as const,
        label: "Aesthetic",
        emoji: "💜",
        color: "from-purple-500 to-fuchsia-500",
        borderColor: "border-purple-500/50",
    },
];

export default function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            {themes.map((t) => (
                <motion.button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`
            relative px-4 py-2 rounded-lg text-xs font-medium tracking-wide
            transition-all duration-300 border
            ${theme === t.id
                            ? `bg-gradient-to-r ${t.color} text-white ${t.borderColor} shadow-lg`
                            : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                        }
          `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="mr-1">{t.emoji}</span>
                    {t.label}
                    {theme === t.id && (
                        <motion.div
                            className={`absolute inset-0 rounded-lg bg-gradient-to-r ${t.color} opacity-20`}
                            layoutId="theme-glow"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
