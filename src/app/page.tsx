import { fetchLeaderbord, handleUpdate } from "@/actions/actions";
import FetchButton from "@/components/FetchButton";
import Image from "next/image";

export default async function Home() {
  // const res = await fetchLeaderbord();
  const resData = await handleUpdate();
  return (
    <main className="flex flex-col items-center justify-between ">
      <div className="pt-4">
        <FetchButton data={resData} />
      </div>
    </main>
  );
}
