"use client";
import AddTaskModal from "@/app/components/task-manager/AddTaskModal";
import DisplayTask from "@/app/components/task-manager/DisplayTask";
import { Plus, Search, SlidersHorizontal} from "lucide-react";
import React, { useState } from "react";

function TaskManager() {
  const [modal, setModal] = useState(false);

  const addTaskModal = async () => {
    if (modal === true) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  return (
    <>
      {modal ? <AddTaskModal /> : ""}

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4 justify-start items-start">
            <h1 className="text-[32px] font-bold">Task Manager</h1>
            <p className="text-[16px]">
              Manage clinical and administrative tasks for your practice.
            </p>
          </div>
          <button
            onClick={addTaskModal}
            className="bg-primary text-white text-[16px] rounded-xl flex gap-2.5 justify-center items-center py-4 px-6"
          >
            <Plus />
            Add Text
          </button>
        </div>
        <div className="rounded-xl py-6 px-5 flex flex-col gap-5 border border-gray-100">
          <div className="flex justify-start text-2xl font-bold items-center gap-3.5">
            <SlidersHorizontal />
            Filters & Controls
          </div>
          <div className="py-3 px-4 flex justify-start items-center bg-gray-100 gap-2.5 rounded-xl border border-gray-200 w-1/3">
            <Search />
            <input
              type="text"
              className="w-full outline-0"
              placeholder="Search by patient name or task.."
            />
          </div>
        </div>
      <DisplayTask/>
      </div>
    </>
  );
}

export default TaskManager;
