"use client";
import React from "react";

const Time = ({ contest }) => {
  return (
    <div>
      {contest.map((con, index) => (
        <p key={index}>
          Последние обновление {con.contest} {con.date.toLocaleString("ru-RU")}
        </p>
      ))}
    </div>
  );
};

export default Time;
