"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const RefreshButton = () => {
  const router = useRouter();
  return (
    <>
      <Button variant="contained" onClick={() => router.refresh()}>
        Обновить
      </Button>
    </>
  );
};

export default RefreshButton;
