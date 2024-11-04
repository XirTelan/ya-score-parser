"use server";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import User from "@/models/User";
import { stat } from "fs";

const getContestData = async () => {
  await dbConnect();
  const users = await User.find().lean();
  return users;
};

function removeEmailPhone(inputString: string) {
  const atIndex = inputString.indexOf("@");

  if (inputString.startsWith("+"))
    return (
      inputString.substring(0, 5) +
      "***" +
      inputString.substring(inputString.length - 4)
    );
  return atIndex !== -1
    ? inputString.substring(0, atIndex + 1) + "..."
    : inputString;
}

export const buildRaiting = async () => {
  const data = await getContestData();
  const map = new Map();
  const raiting = data.map((user: any) => {
    const id = user._id.toString();
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    user.username = removeEmailPhone(user.username);

    const totalTries =
      (user.contest1?.tries || 0) +
      (user.contest2?.tries || 0) +
      (user.contest3?.tries || 0) +
      (user.contest4?.tries || 0);
    const totalCount =
      (user.contest1?.tasks || 0) +
      (user.contest2?.tasks || 0) +
      (user.contest3?.tasks || 0) +
      (user.contest4?.tasks || 0);
    map.set(totalCount, (map.get(totalCount) || 0) + 1);
    const totalFine =
      (user.contest1?.fine || 0) +
      (user.contest2?.fine || 0) +
      (user.contest3?.fine || 0) +
      (user.contest4?.fine || 0);
    return {
      ...user,
      id: id,
      totalTasks: totalCount,
      totalFine: totalFine,
      totalTries: totalTries,
    };
  });
  const sortedMap = Array.from(map);
  sortedMap.sort((a, b) => b[0] - a[0]);
  const dataSet = [] as any;
  sortedMap.forEach((pair) => {
    dataSet.push({
      tasks: pair[0],
      value: pair[1],
    });
  });

  raiting.sort((a, b) => {
    if (a.totalTasks == b.totalTasks) {
      return a.totalTries - b.totalTries;
    } else {
      return b.totalTasks - a.totalTasks;
    }
  });
  const contestCount = 4;
  const tasksValue = 10;

  const counts = [];
  for (let i = 1; i <= contestCount; i++) {
    const query: { [key: string]: number } = {};
    for (let j = 1; j <= i; j++) {
      query[`contest${j}.tasks`] = tasksValue;
    }
    counts.push(await User.countDocuments(query));
  }

  raiting.forEach((user: any, index) => (user.position = index + 1));
  return {
    summary: counts,
    stats: dataSet,
    items: raiting,
  };
};

export const getStatus = async (contest: string) => {
  await dbConnect();
  const status = (await Contest.findOne({ contest: contest }).lean()) as any;
  console.log(status);
  if (status) delete status._id;
  return status;
};
