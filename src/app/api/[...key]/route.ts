import { fetchLeaderbord, updateContest } from "@/actions/actions";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { key } }: { params: { key: string | string[] } }
) {
  if (key == "update12") {
    await dbConnect();
    const count = await User.countDocuments({
      "contest1.tasks": 10,
      "contest2.tasks": 10,
    });
    return NextResponse.json(count);
  }
  if (key != "update")
    return NextResponse.json("Wrong method", { status: 400 });
  await dbConnect();
  const contest = await Contest.findOne({ contest: 1 });
  if (!contest) Contest.create({ contest: 1, date: Date.now() });
  const differenceInMillis = Math.abs(Date.now() - contest.date);
  const differenceInHours = differenceInMillis / (1000 * 60 * 60); // Convert milliseconds to hours
  if (contest.status == "update") {
    if (differenceInHours > 0.5)
      await Contest.updateOne({ contest: 1 }, { status: "ok", step: "ok" });
    return NextResponse.json("Already updating");
  }
  console.log("differenceInHours", differenceInHours);
  const currentDate = new Date();

  const timeDelay = parseInt(process.env?.UPDATE_DELAY || "1");
  if (differenceInHours > timeDelay) {
    const dayOfMonth = currentDate.getDate();

    await Contest.updateOne({ contest: 1 }, { status: "update", step: 0 });

    const promises = [];

    // promises.push(fetchLeaderbord(0, 30, "contest1"));
    await Contest.updateOne({ contest: 1 }, { step: "parsing" });

    if (dayOfMonth < 21) {
      promises.push(fetchLeaderbord(0, 30, "contest2"));
    }
    promises.push(fetchLeaderbord(0, 30, "contest3"));
    if (dayOfMonth > 22) {
      promises.push(fetchLeaderbord(0, 30, "contest4"));
    }

    const results = await Promise.all(promises);

    let index = 0;

    // if (results[index]) {
    //   await updateContest(results[index], "contest1");
    //   index++;
    // }

    if (results[index] && dayOfMonth < 21) {
      await updateContest(results[index], "contest2");
      index++;
    }

    if (results[index]) {
      await updateContest(results[index], "contest3");
      index++;
    }

    if (results[index] && dayOfMonth > 22) {
      await updateContest(results[index], "contest4");
      index++;
    }
    console.log("All updated");
    await Contest.updateOne({ contest: 1 }, { date: Date.now(), status: "ok" });
    console.log("Status - ok");
    return NextResponse.json("updated");
  } else {
    return NextResponse.json("Time is not come");
  }
}
