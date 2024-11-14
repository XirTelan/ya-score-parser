import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Link,
  Card,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { BarChart } from "@mui/x-charts";
import React, { useMemo } from "react";
import { BuildRaiting } from "@/app/page";
import { ContestDTO, StatisticDTO } from "@/types";

const Statistic = ({
  data,
  contestInfo,
  stats,
}: {
  data: BuildRaiting;
  contestInfo: ContestDTO[];
  stats: StatisticDTO;
}) => {
  const chartSetting = {
    width: 500,
    height: 300,
  };

  const chartData = useMemo(
    () =>
      stats.contestSumByTaskTries.slice(0, 25).map((stat) => {
        return {
          x: `${stat.totalTasks}/${stat.totalTries}`,
          y: stat.userCount,
        };
      }),
    [stats.contestSumByTaskTries]
  );
  return (
    <div className="flex flex-col items-center ">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            dataKey: "x",
            label: "Кол-во задач/попыток",
          },
        ]}
        dataset={chartData ?? []}
        series={[
          {
            dataKey: "y",
            label: "Статиска по колву решивих с учетом попыток * (верхние 25)",
          },
        ]}
        yAxis={[{ label: "Количество решивших" }]}
        {...chartSetting}
      />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-stats-content`}
          id={`panel-stats-header`}
        >
          <Box sx={{ display: "flex", gap: "1rem" }}>
            Полная таблица по колву с учетом *
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "rgba(18, 18, 18, 1)" }}>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Кол-во задач</TableCell>
                  <TableCell>Кол-во ппопыток</TableCell>
                  <TableCell>Количество решивших</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.contestSumByTaskTries.map((row, indx) => (
                  <TableRow
                    key={indx}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.totalTasks}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.totalTries}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.userCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {data.stats && data.stats.length > 0 && (
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              dataKey: "tasks",
              label: "Кол-во задач",
            },
          ]}
          dataset={data.stats ?? []}
          series={[{ dataKey: "value", label: "Распределение по задачам" }]}
          yAxis={[{ label: "Количество решивших" }]}
          {...chartSetting}
        />
      )}
      <Card variant="outlined" sx={{ padding: "1rem" }}>
        <Box sx={{ marginBottom: "1rem" }}>
          Статистика решенных задач (успешно/ всего попыток)
        </Box>
        {contestInfo.map((contest) => (
          <Accordion key={`accordion_${contest.contestId}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${contest._id}-content`}
              id={`panel-${contest._id}-header`}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <h2>{contest.contestTitle}</h2>
                <Link
                  href={`https://contest.yandex.ru/contest/${contest.contestId}/standings/`}
                  target={"_blank"}
                >
                  ({contest.contestId})
                </Link>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "rgba(18, 18, 18, 1)" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      {contest.stats.map((stat) => (
                        <TableCell key={`${contest.contestId}_${stat.task}`}>
                          {stat.task}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {contest.stats.map((row) => (
                        <TableCell
                          key={`${contest.contestId}_${row.task}`}
                          component="th"
                          scope="row"
                        >
                          <div className=" text-green-700  ">{row.success}</div>
                          <div className=" text-gray-500  ">{row.attempts}</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
    </div>
  );
};

export default Statistic;
