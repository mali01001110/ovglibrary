import { NextRequest } from "next/server";
import {
  fetchRawg,
  parseRawgQuery,
  sanitizeListResponse,
  type RawgListResponse,
} from "@/lib/rawg";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = parseRawgQuery(searchParams);

  try {
    const data = await fetchRawg<RawgListResponse>("/games", query);
    return Response.json(sanitizeListResponse(data));
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return Response.json(
      { error: "Unable to load games. Please try again." },
      { status: 502 }
    );
  }
}
