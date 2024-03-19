"use client";
import { fetchLeaderbord, handleUpdate } from "@/actions/actions";
import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const FetchButton = ({ data }) => {
  //   const [data, setData] = useState();
  //   const [isLoading, setIsLoading] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const columns: GridColDef[] = [
    { field: "position", headerName: "№", minWidth: 50 },
    { field: "username", headerName: "Имя участника", minWidth: 250, flex: 1 },
    {
      field: "contest1",

      headerName: "Contest 1",
      valueGetter: (params) =>
        `${params.row.contest1?.tasks || 0} | ${
          params.row.contest1?.fine || 0
        }`,
    },
    {
      field: "contest2",
      headerName: "Contest 2",
      valueGetter: (params) =>
        `${params.row.contest2?.tasks || 0} | ${
          params.row.contest2?.fine || 0
        }`,
    },
    {
      field: "contest3",
      headerName: "Contest 3",
      valueGetter: (params) =>
        `${params.row.contest3?.tasks || 0} | ${
          params.row.contest3?.fine || 0
        }`,
    },
    {
      field: "contest4",
      headerName: "Contest 4",
      valueGetter: (params) =>
        `${params.row.contest3?.tasks || 0} | ${
          params.row.contest3?.fine || 0
        }`,
    },
    { field: "totalTasks", headerName: "Итог" },
    { field: "totalFine", headerName: "Штраф" },
  ];
  //   if (isLoading) return <div>Loading</div>;
  return (
    <div>
      <div>
        {data?.length > 0 && (
          <ThemeProvider theme={darkTheme}>
            <DataGrid
              rows={data}
              disableColumnSelector
              disableDensitySelector
              slots={{ toolbar: GridToolbar }}
              columns={columns}
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
            />
          </ThemeProvider>
        )}
      </div>
    </div>
  );
};

export default FetchButton;
