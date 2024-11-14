export type ContestDTO = {
  _id?: string;
  contestTitle: string;
  contestId: string;
  autoUpdate: number;
  attempts: string;
  date?: number;
  stats: {
    task: string;
    success: number;
    attempts: number;
  }[];
  status: string;
};

export type ContestData = {
  _id: string;
  totalTasks: number;
  totalFine: number;
  totalTries: number;
  byContest: { [key: string]: unknown }[];
};

export type RatingDTO = {
  userId: string;
  contestId: string;
  tasks: number;
  fine: number;
  tries: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StatisticDTO = {
  contestUserCount: unknown[];
  contestSumByTaskTries: {
    totalTasks: number;
    totalTries: number;
    userCount: number;
  }[];
};
