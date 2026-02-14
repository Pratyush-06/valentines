"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShareButtonsProps {
    link: string;
}

export default function ShareButtons({ link }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const fullLink = `${typeof window !== "undefined" ? window.location.origin : ""}${link}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = fullLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Send me an anonymous Valentine confession 💖🤫 I dare you! ${fullLink}`
    )}`;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <motion.button
                onClick={handleCopy}
                className={`
                    flex-1 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
                    text-sm font-medium tracking-wide transition-all duration-300
                    ${copied
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:border-white/20"
                    }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        Copy Link
                    </>
                )}
            </motion.button>

            <motion.a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium tracking-wide bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Share on Twitter
            </motion.a>
        </div>
    );
}
