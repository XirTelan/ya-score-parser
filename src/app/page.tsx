import { buildRaiting, getStatus } from "@/actions/actions";
import Leaderboard from "@/components/Leaderboard";
import UpdateInProgress from "@/components/UpdateInProgress";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const disclaimer = `Дисклеймер: относитесь к этой информации с осторожностью. Т.к
  во-первых, скорее всего тут потеряны люди с повторяющимися именами.\n
  Во-вторых, парсятся только первые 30 страниц каждого контеста А
  в-третьих, создатель, возможно -🦀`;
  const contest: any = await getStatus();
  if (contest && contest.status == "update")
    return (
      <div className="flex flex-col min-h-screen w-full justify-center items-center">
        <UpdateInProgress />
      </div>
    );
  const resData = await buildRaiting();

  const date = new Date(contest.date);
  const localDateString = date.toLocaleDateString();
  const localTimeString = date.toLocaleTimeString();
  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        <p>Последнее обновление: {`${localDateString} ${localTimeString}`}</p>
        <Leaderboard data={resData} />
        <p className="text-sm text-slate-400 ">{disclaimer}</p>
      </div>
    </main>
  );
}
