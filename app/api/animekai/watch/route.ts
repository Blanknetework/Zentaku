import { NextRequest, NextResponse } from "next/server";
import { animeKaiWatch, AnimeKaiError } from "@/lib/animekai";

export async function GET(req: NextRequest) {
  const episodeId = req.nextUrl.searchParams.get("episodeId");
  const server = req.nextUrl.searchParams.get("server") ?? "megaup";
  const category = req.nextUrl.searchParams.get("category") ?? "sub";

  if (!episodeId?.trim()) {
    return NextResponse.json({ error: "Missing episodeId" }, { status: 400 });
  }

  try {
    const data = await animeKaiWatch(episodeId, server, category);
    return NextResponse.json(data);
  } catch (e) {
    console.error("AnimeKai Watch Stream Error:", e);
    if (e instanceof AnimeKaiError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status >= 400 && e.status < 600 ? e.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Stream lookup failed", details: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
