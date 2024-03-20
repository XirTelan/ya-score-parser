"use client";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";

const Leaderboard = ({ data }: { data: any }) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const chartSetting = {
    width: 500,
    height: 300,
  };
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
        `${params.row.contest4?.tasks || 0} | ${
          params.row.contest4?.fine || 0
        }`,
    },
    { field: "totalTasks", headerName: "Итог" },
    { field: "totalFine", headerName: "Штраф" },
  ];
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {data.items?.length > 0 && (
          <DataGrid
            rows={data.items}
            disableColumnSelector
            slots={{ toolbar: GridToolbar }}
            columns={columns}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
          />
        )}
        <div className="flex items-center ">
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                dataKey: "tasks",
                label: "Кол-во задач",
              },
            ]}
            dataset={data.stats}
            series={[{ dataKey: "value", label: "Распределение по задачам" }]}
            yAxis={[{ label: "Количество решивших" }]}
            {...chartSetting}
          />
          <div className="text-left pe-4">
            <p>Закрыли 1й контест:</p>
            <p>Закрыли 2 контеста:</p>
            <p>Закрыли 3 контеста:</p>
            <p>Закрыли все 4 контеста:</p>
          </div>
          <div className="text-left pe-4">
            <p>{data.summary[0]}</p>
            <p>{data.summary[1]}</p>
            <p>{data.summary[2]}</p>
            <p>{data.summary[3]}</p>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Leaderboard;
