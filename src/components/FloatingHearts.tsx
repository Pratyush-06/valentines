"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Heart {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

export default function FloatingHearts() {
    const [hearts, setHearts] = useState<Heart[]>([]);

    useEffect(() => {
        const generated: Heart[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 20 + 10,
            duration: Math.random() * 8 + 8,
            delay: Math.random() * 10,
            opacity: Math.random() * 0.3 + 0.05,
        }));
        setHearts(generated);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute text-pink-500"
                    style={{
                        left: `${heart.x}%`,
                        fontSize: `${heart.size}px`,
                        opacity: heart.opacity,
                    }}
                    initial={{ y: "110vh", rotate: 0 }}
                    animate={{
                        y: "-10vh",
                        rotate: [0, 15, -15, 0],
                        x: [0, 30, -30, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    );
}
