import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  db.exec(`
    DELETE FROM matches;
    DELETE FROM swipes;
  `);
  return NextResponse.json({ ok: true });
}
