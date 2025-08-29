// src/app/api/jamendo/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID!;
const BASE = "https://api.jamendo.com/v3.0/tracks/";

const TAGS_BY_GENRE: Record<string, string> = {
    ambient: "instrumental+ambient+chillout+soundscape",
    classical: "instrumental+classical+piano+orchestral+strings",
    lofi: "instrumental+lofi+chillhop+beats",
    jazz: "instrumental+jazz+smoothjazz+chill",
    nature: "ambient+meditation+relax+soundscape",
};

export async function GET(req: Request) {
    try {
        if (!CLIENT_ID) {
            return NextResponse.json({ error: "Missing JAMENDO_CLIENT_ID" }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const genre = searchParams.get("genre") ?? "ambient";
        const page = Number(searchParams.get("page") ?? "1");
        const limit = Number(searchParams.get("limit") ?? "10");
        const offset = (page - 1) * limit;
        const tags = TAGS_BY_GENRE[genre] ?? TAGS_BY_GENRE.ambient;

        const randomOffset = Math.floor(Math.random() * 500); // adjust max range
        const url =
            `${BASE}?client_id=${CLIENT_ID}` +
            `&format=json&limit=${limit}&offset=${randomOffset}` +
            `&tags=${encodeURIComponent(genre)}` +
            `&include=musicinfo&audioformat=mp32&order=popularity_total`;




        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) {
            console.error("❌ Jamendo fetch failed:", res.status, res.statusText);
            return NextResponse.json({ error: "Jamendo fetch failed" }, { status: res.status });
        }

        const data = await res.json();


        const songs = (data.results || []).map((t: any) => ({
            id: String(t.id),
            title: t.name,
            artist: t.artist_name,
            src: t.audio,
            cover: t.album_image || "/covers/default.jpg",
            duration: t.duration ?? 0,
            url: t.shareurl,
        }));


        return NextResponse.json({
            results: songs,
            count: data.headers?.results_count ?? songs.length,
        });
    } catch (e) {
        console.error("🔥 API route error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
