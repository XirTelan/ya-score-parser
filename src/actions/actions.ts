"use server";
import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import User from "@/models/User";
import { parse } from "node-html-parser";

const contests = {
  contest1: process.env.URL_C1,
  contest2: process.env.URL_C2,
  contest3: process.env.URL_C3,
  contest4: process.env.URL_C4,
};
type Contests = keyof typeof contests;

export async function fetchLeaderbord(
  from: number,
  to: number,
  contest: Contests
) {
  let res = [];
  for (let i = from; i < to; i++) {
    const pageData = await fetchPage(contest, i);
    res = [...res, ...pageData];
  }
  return res;
}

const fetchPage = async (contest: Contests, page: number) => {
  const test = await fetch(`${contests[contest]}?p=${page}`, {
    headers: {
      cookie: `Session_id=${process.env.SESSION}`,
    },
  });
  console.log(test.status);
  const data = await test.text();
  const root = parse(data);
  const rows = root.querySelectorAll(".table__row");
  const pageData = [];
  rows.forEach((row) => {
    pageData.push({
      id: row.childNodes[1].textContent,
      tasks: row.childNodes[12].textContent,
      fine: row.childNodes[13].textContent,
    });
  });
  pageData.shift();
  pageData.shift();
  return pageData;
};

const createUser = async (data, contest: Contests) => {
  await dbConnect();
  const user = await User.create({
    username: data.id,
    [contest]: {
      tasks: data.tasks,
      fine: data.fine,
    },
  });
  user.save();
  return user;
};

export const updateContest = async (data, contest: Contests) => {
  await dbConnect();
  for (const user of data) {
    console.log(user.id);
    const filter = { username: user.id };
    const update = {
      [contest]: {
        tasks: user.tasks || 0,
        fine: user.fine || 0,
      },
    };
    let userDb = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (!userDb) {
      userDb = await createUser(user, contest);
    }
  }
};

const getContestData = async () => {
  await dbConnect();
  const users = await User.find().lean();
  return users;
};

export const handleUpdate = async () => {
  return await buildRaiting();
  // fetchLeaderbord(0,10,'contest4')
};
function removeEmail(inputString: string) {
  const atIndex = inputString.indexOf("@");
  let result = "";
  if (atIndex !== -1) {
    result = inputString.substring(0, atIndex + 1) + "...";
  } else {
    result = inputString;
  }
  return result;
}
export const buildRaiting = async () => {
  const data = await getContestData();
  const raiting = data.map((user) => {
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
  raiting.sort((a, b) => {
    if (a.totalTasks == b.totalTasks) {
      return a.totalFine - b.totalFine;
    } else {
      return b.totalTasks - a.totalTasks;
    }
  });
  raiting.forEach((user, index) => (user.position = index + 1));
  return raiting;
};

export const getStatus = async () => {
  await dbConnect();
  const status = Contest.findOne({ contest: 1 }).lean();
  return status;
};
