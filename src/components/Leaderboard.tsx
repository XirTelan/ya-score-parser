"use client";
import { BuildRaiting } from "@/app/page";
import { ContestDTO } from "@/types";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

const Leaderboard = ({
  data,
  contests,
}: {
  data: BuildRaiting;
  contests: ContestDTO[];
}) => {
  const columns: GridColDef[] = [
    { field: "position", headerName: "№", minWidth: 50 },
    { field: "id", headerName: "Имя участника", minWidth: 250, flex: 1 },
  ];
  contests.forEach((element, index) => {
    columns.push({
      field: `contest${index}`,
      headerName: element.contestTitle,
      valueGetter: (params) =>
        `${params.row.byContest[element.contestId]?.tasks || 0} | ${
          params.row.byContest[element.contestId]?.fine || 0
        }`,
    });
  });
  columns.push(
    ...[
      { field: "totalTasks", headerName: "Итог" },
      { field: "totalTries", headerName: "* Попыток" },
      { field: "totalFine", headerName: "Штраф" },
    ]
  );
  return (
    <>
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
    </>
  );
};

export default Leaderboard;
