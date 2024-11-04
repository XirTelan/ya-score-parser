import { buildRaiting, getStatus } from "@/actions/actions";
import Leaderboard from "@/components/Leaderboard";
import Time from "@/components/Time";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const disclaimer = `Дисклеймер: относитесь к этой информации с осторожностью. Т.к
  во-первых, тут потеряны люди с повторяющимися именами.\n
  Во-вторых, создатель, возможно -🦀
  Для 1го контеста спаршены все страницы.`;

  const prom = [getStatus("contest3"), getStatus("contest4")];
  const contest: any = await Promise.all(prom);
  const resData = await buildRaiting();

  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        {contest && <Time contest={contest} />}
        <Leaderboard data={resData} />
        <p className="text-sm text-slate-400 ">{disclaimer}</p>
      </div>
    </main>
  );
}
