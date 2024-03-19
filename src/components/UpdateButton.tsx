"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const UpdateButton = () => {
  const router = useRouter();
  return (
    <Button
      color="warning"
      className="p-2"
      onClick={async () => {
        await fetch("/api/update");
        router.refresh();
      }}
    >
      Обновить лидербоард
    </Button>
  );
};

export default UpdateButton;
