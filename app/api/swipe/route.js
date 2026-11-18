import { NextResponse } from "next/server";
import db from "@/lib/db";
import { processSwipe } from "@/lib/swipeService";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = processSwipe(db, Number(body.profileId), body.direction);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }
  return NextResponse.json(result);
}
