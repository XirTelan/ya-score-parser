import { buildRaiting, getStatus } from "@/actions/actions";
import Leaderboard from "@/components/Leaderboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const disclaimer = `Дисклеймер: относитесь к этой информации с осторожностью. Т.к
  во-первых, скорее всего тут потеряны люди с повторяющимися именами.\n
  во-вторых, создатель, возможно -🦀`;

  const resData = await buildRaiting();
  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        <Leaderboard data={resData.items} stats={resData.stats} />
        <p className="text-sm text-slate-400 ">{disclaimer}</p>
      </div>
    </main>
  );
}
