import { fetchLeaderbord, getStatus, handleUpdate } from "@/actions/actions";
import FetchButton from "@/components/FetchButton";
import Image from "next/image";

export default async function Home() {
  // const res = await fetchLeaderbord();
  const contest = await getStatus();
  if (contest && contest.status == "update")
    return (
      <div className="flex flex-col min-h-screen w-full justify-center items-center">
        <div className="p-4">Server is updating. Progress {contest.step}/6</div>
        <div className=" animate-spin border-t-cyan-500 rounded-full w-20 h-20 border-4 border-slate-600"></div>
      </div>
    );
  const resData = await handleUpdate();
  return (
    <main className="flex flex-col items-center">
      <div className="pt-4 container">
        <FetchButton data={resData} />
      </div>
    </main>
  );
}
