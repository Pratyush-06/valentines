import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Confession from "@/models/confession";
import ValentinePage from "@/models/valentinePage";
import { nanoid } from "nanoid";
import { rateLimiter } from "@/lib/rateLimiter";

// POST /api/confessions — Send an anonymous confession to a page
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
        const { pageId, message, theme = "romantic" } = body;

        if (!pageId || typeof pageId !== "string") {
            return NextResponse.json(
                { error: "Page ID is required" },
                { status: 400 }
            );
        }

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const trimmed = message.trim();
        if (trimmed.length < 10) {
            return NextResponse.json(
                { error: "Message must be at least 10 characters long" },
                { status: 400 }
            );
        }

        if (trimmed.length > 500) {
            return NextResponse.json(
                { error: "Message must be at most 500 characters long" },
                { status: 400 }
            );
        }

        const validThemes = ["romantic", "minimal", "aesthetic"];
        if (!validThemes.includes(theme)) {
            return NextResponse.json(
                { error: "Invalid theme" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify the page exists
        const page = await ValentinePage.findOne({ pageId });
        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 }
            );
        }

        const confessionId = nanoid(10);

        await Confession.create({
            confessionId,
            pageId,
            message: trimmed,
            theme,
        });

        return NextResponse.json({
            success: true,
            confessionId,
        });
    } catch (error) {
        console.error("Error creating confession:", error);
        return NextResponse.json(
            { error: "Failed to send confession" },
            { status: 500 }
        );
    }
}
