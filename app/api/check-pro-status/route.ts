import { NextRequest, NextResponse } from "next/server";
import { checkProStatus, isProUser } from "@/lib/user";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const isPro = await isProUser(email);
  return NextResponse.json({ isPro });
}
