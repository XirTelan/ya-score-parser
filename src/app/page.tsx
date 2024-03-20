import { buildRaiting, getStatus } from "@/actions/actions";
import Leaderboard from "@/components/Leaderboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const disclaimer = `Дисклеймер: относитесь к этой информации с осторожностью. Т.к
  во-первых, скорее всего тут потеряны люди с повторяющимися именами.\n
  Во-вторых, парсятся только первые 30 страниц каждого контеста А
  в-третьих, создатель, возможно -🦀`;
  const contest: any = await getStatus();
  const resData = await buildRaiting();
  const date = new Date(contest.date);

  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        {contest && (
          <p>Последнее обновление: {`${date.toLocaleString("ru-RU")}`}</p>
        )}
        <Leaderboard data={resData} />
        <p className="text-sm text-slate-400 ">{disclaimer}</p>
      </div>
    </main>
  );
}
