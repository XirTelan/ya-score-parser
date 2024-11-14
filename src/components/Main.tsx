"use client";
import { createTheme, Box, Tab, Tabs, ThemeProvider } from "@mui/material";
import React from "react";
import Leaderboard from "./Leaderboard";
import Statistic from "./Statistic";
import UpdatesInfo from "./UpdatesInfo";
import { ContestDTO, StatisticDTO } from "@/types";
import { BuildRaiting } from "@/app/page";

type Props = {
  rating: BuildRaiting;
  contestInfo: ContestDTO[];
  stats: StatisticDTO;
};

const Main = ({ rating, contestInfo, stats }: Props) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab value={"1"} label="Рейтинг" {...a11yProps(0)} />
              <Tab value={"2"} label="Статистика" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Box>
        <div className="pt-4 container gap-4 flex-col flex">
          {value == "1" ? (
            <>
              <UpdatesInfo contests={contestInfo} />
              <Leaderboard data={rating} contests={contestInfo} />
            </>
          ) : (
            <Statistic data={rating} contestInfo={contestInfo} stats={stats} />
          )}
          <p className="text-sm text-slate-400 ">{""}</p>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Main;
