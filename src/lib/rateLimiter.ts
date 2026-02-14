const rateMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export function rateLimiter(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateMap.get(ip);

    if (!record || now > record.resetTime) {
        rateMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }

    if (record.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        Array.from(rateMap.entries()).forEach(([ip, record]) => {
            if (now > record.resetTime) {
                rateMap.delete(ip);
            }
        });
    }, 5 * 60 * 1000);
}
