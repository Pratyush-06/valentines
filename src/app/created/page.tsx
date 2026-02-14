"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import ShareButtons from "@/components/ShareButtons";

function CreatedContent() {
    const searchParams = useSearchParams();
    const pageId = searchParams.get("pageId") || "";
    const secretKey = searchParams.get("secretKey") || "";

    const shareLink = `/to/${pageId}`;
    const inboxLink = `/inbox/${pageId}?key=${secretKey}`;

    const [inboxCopied, setInboxCopied] = useState(false);

    const handleCopyInbox = async () => {
        const fullLink = `${window.location.origin}${inboxLink}`;
        try {
            await navigator.clipboard.writeText(fullLink);
            setInboxCopied(true);
            setTimeout(() => setInboxCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = fullLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setInboxCopied(true);
            setTimeout(() => setInboxCopied(false), 2000);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
            <FloatingHearts />

            <motion.div
                className="relative z-10 w-full max-w-lg text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Success animation */}
                <motion.div
                    className="mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                    <span className="text-7xl md:text-8xl inline-block filter drop-shadow-[0_0_40px_rgba(236,72,153,0.6)]">
                        💖
                    </span>
                </motion.div>

                <motion.h1
                    className="text-2xl md:text-3xl font-bold gradient-text mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Your Page is Ready!
                </motion.h1>

                <motion.p
                    className="text-white/40 text-sm md:text-base mb-8 max-w-sm mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Share the link below so people can send you anonymous
                    Valentine confessions!
                </motion.p>

                {/* Share Link Section */}
                <motion.div
                    className="rounded-2xl border border-pink-500/10 bg-gradient-to-br from-pink-950/20 via-black/40 to-rose-950/20 backdrop-blur-xl p-6 mb-4 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className="text-xs font-medium text-pink-400/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>🔗</span> Share This Link
                    </h2>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-4">
                        <p className="text-white/60 text-sm font-mono break-all">
                            {typeof window !== "undefined" ? window.location.origin : ""}
                            {shareLink}
                        </p>
                    </div>
                    <ShareButtons link={shareLink} />
                </motion.div>

                {/* Inbox Link Section */}
                <motion.div
                    className="rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-950/15 via-black/40 to-orange-950/15 backdrop-blur-xl p-6 mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h2 className="text-xs font-medium text-amber-400/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>🔒</span> Your Secret Inbox
                    </h2>
                    <p className="text-white/30 text-xs mb-3">
                        Only you can access this. Bookmark it — this is your private link to read confessions.
                    </p>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-4">
                        <p className="text-white/50 text-xs font-mono break-all">
                            {typeof window !== "undefined" ? window.location.origin : ""}
                            {inboxLink}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            onClick={handleCopyInbox}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                                text-sm font-medium tracking-wide transition-all duration-300
                                ${inboxCopied
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-amber-500/10 text-amber-300/80 border border-amber-500/20 hover:bg-amber-500/20"
                                }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {inboxCopied ? "✓ Copied!" : "Copy Inbox Link 🔑"}
                        </motion.button>
                        <motion.a
                            href={inboxLink}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Open Inbox 📬
                        </motion.a>
                    </div>
                </motion.div>

                {/* Warning */}
                <motion.div
                    className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    <p className="text-red-300/60 text-xs">
                        ⚠️ Save your inbox link! If you lose it, you won&apos;t be able to read your confessions.
                    </p>
                </motion.div>

                {/* Create another */}
                <motion.a
                    href="/"
                    className="inline-block text-pink-400/50 hover:text-pink-400 text-sm transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    ← Create another page
                </motion.a>
            </motion.div>
        </main>
    );
}

export default function CreatedPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <div className="text-white/30 text-sm">Loading...</div>
                </div>
            }
        >
            <CreatedContent />
        </Suspense>
    );
}
