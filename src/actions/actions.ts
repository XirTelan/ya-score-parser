"use server";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import Rating from "@/models/Rating";
import { ContestData, ContestDTO } from "@/types";

const getContestData = async () => {
  await dbConnect();
  try {
    const results = await Rating.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTasks: { $sum: "$tasks" },
          totalFine: { $sum: "$fine" },
          totalTries: { $sum: "$tries" },
          byContest: {
            $push: {
              k: "$contestId",
              v: {
                tasks: "$tasks",
                fine: "$fine",
                tries: "$tries",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
              },
            },
          },
        },
      },
      {
        $addFields: {
          byContest: {
            $arrayToObject: "$byContest",
          },
        },
      },
      {
        $sort: {
          totalTasks: -1,
          totalTries: 1,
          totalFine: 1,
        },
      },
    ]);

    return results;
  } catch (err) {
    console.error("Error grouping and sorting ratings by userId:", err);
  }
};
export async function getUserCountByTotalTasksAndTotalTries() {
  try {
    await dbConnect();
    const results = await Rating.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTasks: { $sum: "$tasks" },
          totalTries: { $sum: "$tries" },
        },
      },
      {
        $match: {
          totalTries: { $lte: 10 },
        },
      },
      {
        $group: {
          _id: { totalTasks: "$totalTasks", totalTries: "$totalTries" },
          userCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalTasks: "$_id.totalTasks",
          totalTries: "$_id.totalTries",
          userCount: "$userCount",
        },
      },
      {
        $sort: { totalTasks: -1, totalTries: 1 },
      },
    ]);

    return results;
  } catch (err) {
    console.error(
      "Error aggregating user counts by totalTasks and totalTries:",
      err
    );
  }
}
export async function getCountWithMaxTasksForEachContest() {
  await dbConnect();
  const contests = (await getContests()) as ContestDTO[];
  const queue: Promise<unknown>[] = [];
  contests.forEach((contest) => {
    queue.push(
      Rating.countDocuments({
        contestId: contest.contestId,
        tasks: contest.stats.length,
      })
    );
  });
  const queryRes = await Promise.all(queue);
  const dataRes = contests.map((contest, indx) => {
    return { id: contest.contestId, count: queryRes[indx] };
  });
  return dataRes;
}
export async function getStats() {
  const [contestUserCount, contestSumByTaskTries] = await Promise.all([
    getCountWithMaxTasksForEachContest(),
    getUserCountByTotalTasksAndTotalTries(),
  ]);
  return { contestUserCount, contestSumByTaskTries };
}

export async function getContests() {
  try {
    await dbConnect();
    const res = await Contest.find({}, { _id: 0, updatedAt: 0 }).lean();
    return res;
  } catch (error) {
    console.error(error);
  }
}

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
  await dbConnect();
  const data = (await getContestData()) as ContestData[];
  const map = new Map();
  const raiting = data.map((user: any, indx) => {
    user.id = removeEmailPhone(user._id);
    delete user._id;
    user.position = indx + 1;
    map.set(user.totalTasks, (map.get(user.totalTasks) || 0) + 1);
    return {
      ...user,
    };
  });
  const dataSet: {
    tasks: number;
    value: number;
  }[] = [];

  Array.from(map)
    .sort((a, b) => b[0] - a[0])
    .forEach(([tasks, count]) => {
      dataSet.push({
        tasks,
        value: count,
      });
    });
  return {
    items: raiting,
    stats: dataSet,
  };
};

export const getStatus = async (contest: string) => {
  await dbConnect();
  const status = (await Contest.findOne({ contest: contest }).lean()) as any;
  if (status) delete status._id;
  return status;
};
