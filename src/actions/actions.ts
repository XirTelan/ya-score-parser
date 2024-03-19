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
    const pageData = await fetchPage("contest3", i);
    res = [...res, ...pageData];
  }
  return res;
}

const fetchPage = async (contest: Contests, page: number) => {
  const test = await fetch(`${contests[contest]}?p=${page}`, {
    headers: {
      cookie:
        "Session_id=3:1710770240.5.0.1707291275526:-H0Y1Q:84.1.2:1|317328333.0.2.3:1707291275|3:10284701.377257.fCeLverVN5pdFdkOutOrLsky2JQ",
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
  console.log("creating", user);
  user.save();
  return user;
};

const updateContest = async (data, contest: Contests) => {
  await dbConnect();
  console.log("start", data);
  for (const user of data) {
    let userDb = await User.findOne({ username: user.id });
    // console.log("Find:", userDb);
    if (!userDb) {
      // console.log("not find");
      userDb = await createUser(user, contest);
    } else {
      // console.log(" find");
      console.log(user.id, user.fine);
      await User.updateOne(
        { username: user.id },
        {
          [contest]: {
            tasks: data.tasks,
            fine: data.fine,
          },
        }
      );
    }
  }
};

const getContestData = async () => {
  await dbConnect();
  const users = await User.find().lean();
  return users;
};

export const handleUpdate = async () => {
  await dbConnect();
  const contest = await Contest.findOne({ contest: 1 });
  console.log("contest", contest);
  if (!contest) Contest.create({ contest: 1, date: Date.now() });
  const differenceInMillis = Math.abs(Date.now() - contest.date);
  const differenceInHours = differenceInMillis / (1000 * 60 * 60); // Convert milliseconds to hours
  console.log("differenceInHours", differenceInHours);

  if (differenceInHours > 1) {
    const res1 = await fetchLeaderbord(0, 2, "contest1");
    // const res2 = await fetchLeaderbord(0, 10, "contest2");
    // const res3 = await fetchLeaderbord(0, 10, "contest3");
    await updateContest(res1, "contest1");
    // await updateContest(res2, "contest2");
    // await updateContest(res3, "contest3");
    // updateContest(res4)
    await Contest.updateOne({ contest: 1 }, { date: Date.now() });
  }

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
      (user.contest3?.tasks || 0);
    const totalFine =
      (user.contest1?.fine || 0) +
      (user.contest2?.fine || 0) +
      (user.contest3?.fine || 0);
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
  raiting.forEach((user, index) => (user.position = index));
  console.log(raiting);
  return raiting;
};
