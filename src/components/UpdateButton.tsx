"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
const UpdateButton = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => setCounter((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isLoading]);
  return (
    <>
      <Button
        color="warning"
        className="p-2"
        onClick={async () => {
          setIsLoading(true);
          await fetch("/api/update");
          setIsLoading(false);
          router.refresh();
        }}
      >
        Обновить лидербоард
      </Button>
      {isLoading && (
        <div className="flex flex-col justify-center items-center absolute left-0 right-0 top-0 bottom-0 bg-neutral-900/80">
          <div className="flex flex-col items-center bg-neutral-900 border-neutral-500 border p-4 rounded">
            <div className="animate-spin border-t-cyan-500 rounded-full w-20 h-20 border-4 border-slate-600"></div>
            <p>Прошло: {counter} секунд</p>
            {counter > 30 && (
              <>
                <p className="text-center mb-2">Пункт1. Нет, оно не зависло</p>
                <Image
                  className="py-4"
                  src={"/itslive.jpg"}
                  alt={""}
                  width={250}
                  height={250}
                />
                <p>Пункт2.Просто процесс долгий</p>
              </>
            )}
            {counter > 60 && (
              <>
                <p>Пункт3.Перечитать пункт 1</p>
              </>
            )}
            {counter > 180 && (
              <>
                <p className=" animate-pulse ">Но возможно и зависло...</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateButton;
