"use client";
import React from "react";

const Time = ({ contest }: { contest: { contest: string; date: Date }[] }) => {
  return (
    <div>
      {contest.map((con, index) => {
        console.log("wtf", con);
        if (!con) return;
        return (
          <p key={index}>
            Последние обновление {con.contest}{" "}
            {con.date.toLocaleString("ru-RU")}
          </p>
        );
      })}
    </div>
  );
};

export default Time;
