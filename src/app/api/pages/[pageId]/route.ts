import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ValentinePage from "@/models/valentinePage";

// GET /api/pages/[pageId] — Get page info (public, no secret)
export async function GET(
    request: NextRequest,
    { params }: { params: { pageId: string } }
) {
    try {
        await dbConnect();

        const page = await ValentinePage.findOne({ pageId: params.pageId });

        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            pageId: page.pageId,
            displayName: page.displayName,
        });
    } catch (error) {
        console.error("Error fetching page:", error);
        return NextResponse.json(
            { error: "Failed to fetch page" },
            { status: 500 }
        );
    }
}
