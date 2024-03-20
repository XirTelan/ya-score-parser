import { fetchLeaderbord, updateContest } from "@/actions/actions";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";

import { Contests } from "../../types";

export async function updateAll(from: number, to: number) {
  const promises = [];

  await dbConnect();

  promises.push(fetchLeaderbord(from, to, "contest1"));
  promises.push(fetchLeaderbord(from, to, "contest2"));
  promises.push(fetchLeaderbord(from, to, "contest3"));
  promises.push(fetchLeaderbord(from, to, "contest4"));
  const results = await Promise.all(promises);

  let index = 0;
  for (index; index < results.length; index++) {
    await updateContest(results[index], `contest${index}` as Contests);
  }
  await Contest.findOneAndUpdate({ contest: 1 }, { date: Date.now() });
  console.log("All updated");
}

export const updateOne = async (
  contest: Contests,
  from: number,
  to: number
) => {
  await dbConnect();
  const res = await fetchLeaderbord(from, to, contest);
  await updateContest(res, contest as Contests);
  await Contest.findOneAndUpdate({ contest: 1 }, { date: Date.now() });
  console.log("All updated");
};
