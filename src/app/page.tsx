import { buildRaiting, getStatus } from "@/actions/actions";
import Leaderboard from "@/components/Leaderboard";
import RefreshButton from "@/components/RefreshButton";
import UpdateButtonWrapper from "@/components/UpdateButtonWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // const res = await fetchLeaderbord();
  const contest: any = await getStatus();
  if (contest && contest.status == "update")
    return (
      <div className="flex flex-col min-h-screen w-full justify-center items-center">
        <div className="p-4">Server is updating. Progress {contest.step}/6</div>
        <div className=" animate-spin border-t-cyan-500 rounded-full w-20 h-20 border-4 border-slate-600"></div>
        <RefreshButton />
      </div>
    );
  const resData = await buildRaiting();
  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        <Leaderboard data={resData} />
        <UpdateButtonWrapper />
      </div>
    </main>
  );
}
