"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import { Suspense } from "react";

interface ConfessionItem {
    confessionId: string;
    message: string;
    theme: "romantic" | "minimal" | "aesthetic";
    createdAt: string;
}

function InboxContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const pageId = params.pageId as string;
    const key = searchParams.get("key") || "";

    const [displayName, setDisplayName] = useState("");
    const [confessions, setConfessions] = useState<ConfessionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConfession, setSelectedConfession] = useState<ConfessionItem | null>(null);

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const res = await fetch(`/api/pages/${pageId}/inbox?key=${encodeURIComponent(key)}`);
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Access denied");
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setDisplayName(data.displayName);
                setConfessions(data.confessions);
                setLoading(false);
            } catch {
                setError("Failed to load inbox");
                setLoading(false);
            }
        };
        fetchInbox();
    }, [pageId, key]);

    const themeStyles = {
        romantic: {
            card: "border-pink-500/15 bg-gradient-to-br from-pink-950/40 via-black/30 to-rose-950/40",
            accent: "text-pink-400",
            badge: "bg-pink-500/10 text-pink-400/80",
        },
        minimal: {
            card: "border-zinc-700/20 bg-zinc-900/60",
            accent: "text-zinc-300",
            badge: "bg-zinc-500/10 text-zinc-400/80",
        },
        aesthetic: {
            card: "border-purple-500/15 bg-gradient-to-br from-purple-950/40 via-black/30 to-fuchsia-950/40",
            accent: "text-purple-400",
            badge: "bg-purple-500/10 text-purple-400/80",
        },
    };

    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    📬
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 bg-black">
                <FloatingHearts />
                <motion.div
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-6xl mb-6 inline-block">🔒</span>
                    <h1 className="text-2xl font-bold text-white/80 mb-3">
                        Access Denied
                    </h1>
                    <p className="text-white/40 text-sm mb-6">{error}</p>
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

    return (
        <main className="relative min-h-screen px-4 py-12">
            <FloatingHearts />

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-4xl mb-3 inline-block">📬</span>
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                        Your Secret Inbox
                    </h1>
                    <p className="text-white/40 text-sm">
                        Hey <span className="text-pink-400">{displayName}</span>,
                        you have{" "}
                        <span className="text-pink-400 font-semibold">
                            {confessions.length}
                        </span>{" "}
                        {confessions.length === 1 ? "confession" : "confessions"} 💌
                    </p>
                </motion.div>

                {/* Empty state */}
                {confessions.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-6xl inline-block mb-4 opacity-50">💌</span>
                        <p className="text-white/30 text-sm mb-2">
                            No confessions yet...
                        </p>
                        <p className="text-white/20 text-xs mb-6">
                            Share your link and wait for the magic to happen!
                        </p>
                        <motion.button
                            onClick={() => {
                                const shareLink = `${window.location.origin}/to/${pageId}`;
                                navigator.clipboard.writeText(shareLink);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-pink-500/10 text-pink-400 text-sm border border-pink-500/20 hover:bg-pink-500/20 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Copy Share Link 🔗
                        </motion.button>
                    </motion.div>
                )}

                {/* Confessions grid */}
                <div className="space-y-4">
                    {confessions.map((confession, index) => {
                        const style = themeStyles[confession.theme];
                        return (
                            <motion.div
                                key={confession.confessionId}
                                className={`relative rounded-xl border ${style.card} backdrop-blur-sm p-5 cursor-pointer hover:border-pink-500/25 transition-all duration-300`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setSelectedConfession(confession)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                                            &ldquo;{confession.message}&rdquo;
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${style.badge}`}>
                                            {confession.theme}
                                        </span>
                                        <span className="text-white/20 text-[10px]">
                                            {formatTime(confession.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Share link reminder */}
                {confessions.length > 0 && (
                    <motion.div
                        className="text-center mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-white/20 text-xs">
                            Want more confessions?{" "}
                            <button
                                onClick={() => {
                                    const shareLink = `${window.location.origin}/to/${pageId}`;
                                    navigator.clipboard.writeText(shareLink);
                                }}
                                className="text-pink-400/50 hover:text-pink-400 transition-colors underline"
                            >
                                Copy your share link
                            </button>
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Modal for full confession */}
            <AnimatePresence>
                {selectedConfession && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedConfession(null)}
                    >
                        <motion.div
                            className={`relative w-full max-w-md rounded-2xl border ${themeStyles[selectedConfession.theme].card
                                } backdrop-blur-xl p-8`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-40" />

                            <div className="text-pink-500/20 text-5xl font-serif leading-none mb-3">
                                &ldquo;
                            </div>
                            <p className="text-white/80 text-base leading-relaxed mb-3">
                                {selectedConfession.message}
                            </p>
                            <div className="text-pink-500/20 text-5xl font-serif leading-none text-right mb-4">
                                &rdquo;
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${themeStyles[selectedConfession.theme].badge
                                        }`}
                                >
                                    {selectedConfession.theme}
                                </span>
                                <span className="text-white/20 text-xs">
                                    {formatTime(selectedConfession.createdAt)}
                                </span>
                            </div>

                            <p className="text-center text-white/20 text-xs mt-4">
                                Anonymous confession 🤫
                            </p>

                            <button
                                onClick={() => setSelectedConfession(null)}
                                className="absolute top-3 right-3 text-white/20 hover:text-white/50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function InboxPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <div className="text-white/30 text-sm">Loading...</div>
                </div>
            }
        >
            <InboxContent />
        </Suspense>
    );
}
