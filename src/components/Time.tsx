"use client";
import React from "react";

const Time = ({ contest }) => {
  console.log("contest", contest);
  return (
    <div>
      {contest.map((con) => (
        <p key={con._id}>
          Последние обновление {con.contest} {con.date.toLocaleString("ru-RU")}
        </p>
      ))}
    </div>
  );
};

export default Time;
