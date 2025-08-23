"use client";
import DisplayTask from "@/app/components/task-manager/DisplayTask";
import React, { useState } from "react";

function TaskManager() {
  

  return (
    <>
    

      <div className="flex flex-col gap-6">
       
        <DisplayTask/>
      </div>
    </>
  );
}

export default TaskManager;
