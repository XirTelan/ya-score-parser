import React from "react";

const loading = () => {
  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center">
      <div className="p-4">Loading</div>
      <div className=" animate-spin border-t-cyan-500 rounded-full w-20 h-20 border-4 border-slate-600"></div>
    </div>
  );
};

export default loading;
