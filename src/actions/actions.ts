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

const removeEmail = (inputString: string) => {
  const atIndex = inputString.indexOf("@");
  let result = "";
  if (atIndex !== -1) {
    result = inputString.substring(0, atIndex + 1) + "...";
  } else {
    result = inputString;
  }
  return result;
};
export const buildRaiting = async () => {
  const data = await getContestData();
  const map = new Map();
  const raiting = data.map((user: any) => {
    const id = user._id.toString();
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    user.username = removeEmail(user.username);
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
      return a.totalFine - b.totalFine;
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
  if (status) delete status._id;
  return status;
};
