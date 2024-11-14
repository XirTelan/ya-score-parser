import { buildRaiting, getContests, getStats } from "@/actions/actions";
import Main from "@/components/Main";
import { ContestDTO, StatisticDTO } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [resData, contestsInfo, stats] = await Promise.all([
    buildRaiting(),
    getContests(),
    getStats(),
  ]);

  return (
    <main className="flex flex-col items-center">
      <Main
        rating={resData}
        contestInfo={contestsInfo as ContestDTO[]}
        stats={stats as StatisticDTO}
      />
    </main>
  );
}

export type BuildRaiting = {
  items: {
    totalTasks: 25;
    totalFine: 17499;
    totalTries: 1;
    byContest: {
      [key: string]: {
        tasks: "$tasks";
        fine: "$fine";
        tries: "$tries";
        createdAt: "$createdAt";
        updatedAt: "$updatedAt";
      };
    };
    id: "BB";
    position: 87;
  }[];
  stats: {
    tasks: number;
    value: number;
  }[];
};
