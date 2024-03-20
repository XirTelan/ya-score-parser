"use client";
import { updateAll, updateOne } from "@/actions/update";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import React, { useState } from "react";
import { Contests } from "../../types";
import dbConnect from "@/dbConnect";

const UpdateActions = () => {
  const [data, setData] = useState({
    from: 0,
    to: 0,
    contest: "contest1" as Contests,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const submit = async (all: boolean) => {
    const query = `/api?from=${data.from}&to=${data.to}`;
    let res;
    setIsLoading(true);
    setStatus("Loading");
    if (all) {
      res = await fetch(`${query}&contest=all`);
    } else {
      res = await fetch(`${query}&contest=${data.contest}`);
    }
    setIsLoading(false);
    if (res.ok) setStatus("ok");
  };

  const commonStyle = "bg-neutral-800 p-2 m-2 max-w-20";
  return (
    <div className="flex p-4 items-center">
      {status && <p className="mx-2">{status}</p>}
      <label htmlFor="from">From</label>
      <input
        id="from"
        value={data.from}
        onChange={(e) =>
          setData((prev) => ({ ...prev, from: +e.target.value }))
        }
        className={commonStyle}
        type="number"
      />
      <label htmlFor="to">From</label>
      <input
        id="to"
        value={data.to}
        onChange={(e) => setData((prev) => ({ ...prev, to: +e.target.value }))}
        className={commonStyle}
        type="number"
      />
      <select
        value={data.contest}
        onChange={(e) => setData((prev) => ({ ...prev, to: +e.target.value }))}
        className={commonStyle}
      >
        <option value="contest1">1</option>
        <option value="contest2">2</option>
        <option value="contest3">3</option>
        <option value="contest4">4</option>
      </select>
      <ThemeProvider theme={darkTheme}>
        <Button onClick={async () => submit(false)}>
          Обновить выбранный контест
        </Button>
        <Button onClick={async () => submit(true)}>Обновить всё</Button>
      </ThemeProvider>
    </div>
  );
};

export default UpdateActions;
