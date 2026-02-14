import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Confession from "@/models/confession";
import ValentinePage from "@/models/valentinePage";

// GET /api/pages/[pageId]/inbox?key=SECRET_KEY — Get all confessions (private)
export async function GET(
    request: NextRequest,
    { params }: { params: { pageId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { error: "Secret key is required to view inbox" },
                { status: 401 }
            );
        }

        await dbConnect();

        // Verify the page and secret key
        const page = await ValentinePage.findOne({ pageId: params.pageId });

        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 }
            );
        }

        if (page.secretKey !== key) {
            return NextResponse.json(
                { error: "Invalid secret key" },
                { status: 403 }
            );
        }

        // Fetch all confessions for this page
        const confessions = await Confession.find({ pageId: params.pageId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            displayName: page.displayName,
            confessions: confessions.map((c) => ({
                confessionId: c.confessionId,
                message: c.message,
                theme: c.theme,
                createdAt: c.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching inbox:", error);
        return NextResponse.json(
            { error: "Failed to fetch inbox" },
            { status: 500 }
        );
    }
}
