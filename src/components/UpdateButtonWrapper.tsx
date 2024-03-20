import dbConnect from "@/dbConnect";
import Contest from "@/models/Contest";
import React from "react";
import UpdateButton from "./UpdateButton";

const UpdateButtonWrapper = async () => {
  await dbConnect();
  const contest = await Contest.findOne({ contest: 1 });
  const remain = getTimeUntilUpdate(
    contest.date,
    parseInt(process.env.UPDATE_DELAY || "1") * 60
  );

  function getTimeUntilUpdate(previousTime: number, thresholdMinutes: number) {
    const currentTime = Date.now();
    const differenceInMillis = Math.abs(currentTime - previousTime);
    const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));

    const remainingMinutes =
      thresholdMinutes - (differenceInMinutes % thresholdMinutes);
    const remainingHours = Math.floor(differenceInMinutes / thresholdMinutes);

    if (remainingHours > 0) {
      return `КД  ${remainingHours} часов и ${remainingMinutes} минут для обновления`;
    } else {
      return `КД ${remainingMinutes} минут для обновления`;
    }
  }

  return (
    <>
      <UpdateButton />
      {remain}
    </>
  );
};

export default UpdateButtonWrapper;
