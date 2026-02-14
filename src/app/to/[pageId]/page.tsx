"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import MusicToggle from "@/components/MusicToggle";
import ThemeSelector from "@/components/ThemeSelector";

export default function ConfessToPage() {
    const params = useParams();
    const pageId = params.pageId as string;

    const [displayName, setDisplayName] = useState("");
    const [message, setMessage] = useState("");
    const [theme, setTheme] = useState<"romantic" | "minimal" | "aesthetic">("romantic");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [pageNotFound, setPageNotFound] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const charCount = message.length;
    const isValid = charCount >= 10 && charCount <= 500;

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch(`/api/pages/${pageId}`);
                if (!res.ok) {
                    setPageNotFound(true);
                    setPageLoading(false);
                    return;
                }
                const data = await res.json();
                setDisplayName(data.displayName);
                setPageLoading(false);
            } catch {
                setPageNotFound(true);
                setPageLoading(false);
            }
        };
        fetchPage();
    }, [pageId]);

    const handleSubmit = async () => {
        if (!isValid || loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/confessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId, message, theme }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
                return;
            }

            setSent(true);
        } catch {
            setError("Failed to send confession. Please try again.");
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    💖
                </motion.div>
            </div>
        );
    }

    if (pageNotFound) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 bg-black">
                <FloatingHearts />
                <motion.div
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-6xl mb-6 inline-block">💔</span>
                    <h1 className="text-2xl font-bold text-white/80 mb-3">
                        Page Not Found
                    </h1>
                    <p className="text-white/40 text-sm mb-6">
                        This Valentine page doesn&apos;t exist or has been removed.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300"
                    >
                        Create Your Own 💖
                    </a>
                </motion.div>
            </main>
        );
    }

    // Sent confirmation
    if (sent) {
        return (
            <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <FloatingHearts />
                <motion.div
                    className="relative z-10 text-center max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="text-7xl inline-block mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        💌
                    </motion.span>
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                        Confession Sent!
                    </h1>
                    <p className="text-white/40 text-sm mb-2">
                        Your anonymous confession has been delivered to{" "}
                        <span className="text-pink-400">{displayName}</span>.
                    </p>
                    <p className="text-white/25 text-xs mb-8">
                        They&apos;ll never know who sent it 🤫
                    </p>
                    <div className="flex flex-col items-center gap-3">
                        <motion.button
                            onClick={() => {
                                setMessage("");
                                setSent(false);
                                setError("");
                            }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Send Another Confession 💕
                        </motion.button>
                        <a
                            href="/"
                            className="text-white/30 hover:text-white/50 text-xs transition-colors"
                        >
                            Create your own page
                        </a>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
            <FloatingHearts />
            <MusicToggle />

            <motion.div
                className="relative z-10 w-full max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.span
                        className="text-5xl inline-block mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        💌
                    </motion.span>
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                        Confess to{" "}
                        <span className="text-pink-400">{displayName}</span>
                    </h1>
                    <p className="text-white/40 text-sm">
                        Write an anonymous confession. They&apos;ll never know who you are 🤫
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="relative rounded-2xl border border-pink-500/10 bg-gradient-to-br from-pink-950/30 via-black/50 to-rose-950/30 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_80px_rgba(236,72,153,0.08)]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-50" />

                    {/* Textarea */}
                    <div className="relative">
                        <textarea
                            id="confession-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your anonymous confession..."
                            rows={6}
                            maxLength={500}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-white/90 placeholder-white/20 text-base leading-relaxed focus:outline-none focus:border-pink-500/30 focus:bg-white/[0.05] transition-all duration-300"
                        />
                        <div className="flex items-center justify-between mt-2 px-1">
                            <span
                                className={`text-xs transition-colors duration-300 ${charCount === 0
                                        ? "text-white/20"
                                        : charCount < 10
                                            ? "text-amber-400/70"
                                            : charCount > 480
                                                ? "text-amber-400/70"
                                                : "text-white/30"
                                    }`}
                            >
                                {charCount < 10 && charCount > 0
                                    ? `${10 - charCount} more characters needed`
                                    : `${charCount}/500`}
                            </span>
                        </div>
                    </div>

                    {/* Theme selector */}
                    <div className="mt-5">
                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">
                            Theme
                        </label>
                        <ThemeSelector theme={theme} onChange={setTheme} />
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p
                            className="mt-4 text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2 px-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Submit button */}
                    <motion.button
                        id="send-confession-btn"
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className={`
                            w-full mt-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide
                            transition-all duration-300 relative overflow-hidden
                            ${isValid && !loading
                                ? "bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-[length:200%_100%] text-white hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] active:scale-[0.98]"
                                : "bg-white/5 text-white/20 cursor-not-allowed"
                            }
                        `}
                        whileHover={isValid && !loading ? { scale: 1.01 } : {}}
                        whileTap={isValid && !loading ? { scale: 0.98 } : {}}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.span
                                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                />
                                Sending...
                            </span>
                        ) : (
                            "Send Anonymous Confession 💖"
                        )}
                    </motion.button>
                </motion.div>

                <motion.p
                    className="text-center text-white/15 text-xs mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Your identity is 100% anonymous. No data is tracked.
                </motion.p>
            </motion.div>
        </main>
    );
}
