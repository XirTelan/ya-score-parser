import { ContestDTO } from "@/types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const UpdatesInfo = ({ contests }: { contests: ContestDTO[] }) => {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Ид</TableCell>
              <TableCell>Контест</TableCell>
              <TableCell align="right">Последнее обновление</TableCell>
              <TableCell align="right">Период автообновления(мин)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest) => (
              <TableRow
                key={contest.contestId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{contest.contestId}</TableCell>
                <TableCell component="th" scope="row">
                  {contest.contestTitle}
                </TableCell>
                <TableCell align="right">
                  {contest.date
                    ? new Date(contest.date ?? Date.now()).toLocaleString()
                    : "Не обновлялся"}
                </TableCell>
                <TableCell align="right">
                  {contest.autoUpdate || "Не обновляется"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UpdatesInfo;
