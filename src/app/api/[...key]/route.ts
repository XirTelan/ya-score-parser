import { fetchLeaderbord, updateContest } from "@/actions/actions";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { key } }: { params: { key: string | string[] } }
) {
  console.log("hit", key);
  if (key != process.env.SECRET)
    return NextResponse.json("Wrong key", { status: 400 });
  await dbConnect();
  const contest = await Contest.findOne({ contest: 1 });
  if (!contest) Contest.create({ contest: 1, date: Date.now() });
  const differenceInMillis = Math.abs(Date.now() - contest.date);
  const differenceInHours = differenceInMillis / (1000 * 60 * 60); // Convert milliseconds to hours
  console.log("differenceInHours", differenceInHours);
  const currentDate = new Date();

  // Get the day of the month
  const timeDelay = parseInt(process.env?.UPDATE_DELAY || "1");
  if (differenceInHours > timeDelay) {
    const dayOfMonth = currentDate.getDate();

    await Contest.updateOne({ contest: 1 }, { status: "update", step: 0 });
    const res1 = await fetchLeaderbord(0, 10, "contest1");
    await Contest.updateOne({ contest: 1 }, { step: 1 });
    const res2 = await fetchLeaderbord(0, 10, "contest2");
    await Contest.updateOne({ contest: 1 }, { step: 2 });
    const res3 = await fetchLeaderbord(0, 10, "contest3");
    await Contest.updateOne({ contest: 1 }, { step: 3 });
    let res4;
    if (dayOfMonth > 22) res4 = await fetchLeaderbord(0, 10, "contest4");
    await updateContest(res1, "contest1");
    await Contest.updateOne({ contest: 1 }, { step: 4 });
    await updateContest(res2, "contest2");
    await Contest.updateOne({ contest: 1 }, { step: 5 });
    await updateContest(res3, "contest3");
    await Contest.updateOne({ contest: 1 }, { step: 6 });
    if (dayOfMonth > 22) await updateContest(res4, "contest4");
    await Contest.updateOne({ contest: 1 }, { date: Date.now(), status: "ok" });
  }

  return NextResponse.json("ok");
}
