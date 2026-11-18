import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getFeed } from "@/lib/swipeService";

export async function GET() {
  return NextResponse.json({ profiles: getFeed(db) });
}
