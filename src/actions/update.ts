import { fetchLeaderbord, updateContest } from "@/actions/actions";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";

import { Contests } from "../../types";

export async function updateAll(from: number, to: number) {
  const promises = [];
  const res = await initUpdate();
  if (!res) return;
  await dbConnect();

  promises.push(fetchLeaderbord(from, to, "contest1"));
  promises.push(fetchLeaderbord(from, to, "contest2"));
  promises.push(fetchLeaderbord(from, to, "contest3"));
  promises.push(fetchLeaderbord(from, to, "contest4"));
  const results = await Promise.all(promises);

  await Contest.updateOne({ contest: 1 }, { step: "parsing" });
  let index = 0;
  for (index; index < results.length; index++) {
    await updateContest(results[index], `contest${index}` as Contests);
  }

  console.log("All updated");
  await Contest.updateOne({ contest: 1 }, { date: Date.now(), status: "ok" });
  console.log("Status - ok");
}

const initUpdate = async () => {
  await dbConnect();
  const contest = await Contest.findOne({ contest: 1 });
  if (!contest) Contest.create({ contest: 1, date: Date.now() });
  const differenceInMillis = Math.abs(Date.now() - contest.date);
  const differenceInHours = differenceInMillis / (1000 * 60 * 60);
  if (contest.status == "update") {
    if (differenceInHours > 0.2)
      await Contest.updateOne({ contest: 1 }, { status: "ok", step: "ok" });
  }
  console.log("differenceInHours", differenceInHours);

  await Contest.updateOne(
    { contest: 1 },
    { date: Date.now(), status: "ok", step: "ok" }
  );
  return true;
};

export const updateOne = async (
  contest: Contests,
  from: number,
  to: number
) => {
  await dbConnect();
  const status = await initUpdate();
  if (!status) return;

  const res = await fetchLeaderbord(from, to, contest);
  await updateContest(res, contest as Contests);
  await Contest.updateOne(
    { contest: 1 },
    { date: Date.now(), status: "ok", step: "ok" }
  );
};
