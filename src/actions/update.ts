import { fetchLeaderbord, updateContest } from "@/actions/actions";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";

import { Contests } from "../../types";

export const updateOne = async (
  contest: Contests,
  from: number,
  to: number
) => {
  await dbConnect();
  const res = await fetchLeaderbord(from, to, contest);
  console.log(res);
  await updateContest(res, contest as Contests);
  const date = Date.now();
  const curContest = await Contest.findOneAndUpdate(
    { contest: contest },
    { date: date }
  );
  if (!curContest)
    Contest.create({
      contest: contest,
      date: date,
    });
  console.log("All updated", new Date(date).toLocaleString("ru-RU"));
};
