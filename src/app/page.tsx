"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import MusicToggle from "@/components/MusicToggle";

export default function HomePage() {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isValid = displayName.trim().length >= 1 && displayName.trim().length <= 50;

  const handleCreate = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Redirect to the created page with share/inbox links
      router.push(
        `/created?pageId=${data.pageId}&secretKey=${data.secretKey}`
      );
    } catch {
      setError("Failed to create your page. Please try again.");
      setLoading(false);
    }
  };

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
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.span
            className="text-5xl md:text-6xl inline-block mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            💌
          </motion.span>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Secret Valentine
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-sm mx-auto">
            Create your anonymous confession page. Share it and let people
            send you secret Valentine messages!
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="relative rounded-2xl border border-pink-500/10 bg-gradient-to-br from-pink-950/30 via-black/50 to-rose-950/30 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_80px_rgba(236,72,153,0.08)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-50" />

          {/* How it works */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">
              How it works
            </h2>
            <div className="space-y-2">
              {[
                { emoji: "💖", text: "Enter your name or alias" },
                { emoji: "🔗", text: "Get a unique shareable link" },
                { emoji: "💬", text: "Share it — anyone can confess anonymously to you" },
                { emoji: "🔒", text: "Only you can read the confessions via your secret inbox" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-sm text-white/40"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-base">{step.emoji}</span>
                  <span>{step.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5 mb-6" />

          {/* Name input */}
          <div>
            <label
              htmlFor="display-name"
              className="text-xs text-white/30 uppercase tracking-wider mb-2 block"
            >
              Your Name or Alias
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Your Crush, Secret Admirer..."
              maxLength={50}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-3.5 text-white/90 placeholder-white/20 text-base focus:outline-none focus:border-pink-500/30 focus:bg-white/[0.05] transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
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
            id="create-page-btn"
            onClick={handleCreate}
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
            animate={
              isValid && !loading
                ? { backgroundPosition: ["0% center", "200% center"] }
                : {}
            }
            transition={{
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Creating...
              </span>
            ) : (
              "Create My Valentine Page 💖"
            )}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-white/15 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          All confessions are 100% anonymous. No identity is ever tracked.
        </motion.p>
      </motion.div>
    </main>
  );
}
