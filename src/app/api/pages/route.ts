import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ValentinePage from "@/models/valentinePage";
import { nanoid } from "nanoid";
import { rateLimiter } from "@/lib/rateLimiter";

// POST /api/pages — Create a new valentine page
export async function POST(request: NextRequest) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "unknown";
        const { allowed } = rateLimiter(ip);

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a moment." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { displayName } = body;

        if (!displayName || typeof displayName !== "string") {
            return NextResponse.json(
                { error: "Display name is required" },
                { status: 400 }
            );
        }

        const trimmed = displayName.trim();
        if (trimmed.length < 1 || trimmed.length > 50) {
            return NextResponse.json(
                { error: "Display name must be 1–50 characters" },
                { status: 400 }
            );
        }

        await dbConnect();

        const pageId = nanoid(8);
        const secretKey = nanoid(20);

        await ValentinePage.create({
            pageId,
            displayName: trimmed,
            secretKey,
        });

        return NextResponse.json({
            pageId,
            secretKey,
            shareLink: `/to/${pageId}`,
            inboxLink: `/inbox/${pageId}?key=${secretKey}`,
        });
    } catch (error) {
        console.error("Error creating page:", error);
        return NextResponse.json(
            { error: "Failed to create page" },
            { status: 500 }
        );
    }
}
