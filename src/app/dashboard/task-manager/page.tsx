"use client";
import AddTaskModal from "@/app/components/task-manager/AddTaskModal";
import DisplayTask from "@/app/components/task-manager/DisplayTask";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
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
