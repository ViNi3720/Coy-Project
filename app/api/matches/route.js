import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getMatches } from "@/lib/swipeService";

export async function GET() {
  return NextResponse.json({ matches: getMatches(db) });
}
