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
    contest: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const submit = async () => {
    const query = `/api?from=${data.from}&to=${data.to}`;
    setIsLoading(true);
    setStatus("Loading");
    const res = await fetch(`${query}&contest=${data.contest}`);
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
        onChange={(e) =>
          setData((prev) => ({ ...prev, contest: +e.target.value }))
        }
        className={commonStyle}
      >
        <option value={0}>Все</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>
      <ThemeProvider theme={darkTheme}>
        <Button onClick={submit}>Обновить</Button>
      </ThemeProvider>
    </div>
  );
};

export default UpdateActions;
