import { updateAll, updateOne } from "@/actions/update";
import { NextRequest, NextResponse } from "next/server";
import { Contests } from "../../../types";

export async function GET(request: NextRequest) {
  const contest = `contest${request.nextUrl.searchParams
    .get("contest")
    ?.trim()}`;
  const from = request.nextUrl.searchParams.get("from")?.trim();
  const to = request.nextUrl.searchParams.get("to")?.trim();
  if (!from || !to) return NextResponse.json("", { status: 400 });
  if (contest == "contest0") {
    await updateAll(+from, +to);
  } else {
    await updateOne(contest as Contests, +from, +to);
  }
  return NextResponse.json("ok");
}
