"use client";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import React, { useState } from "react";
const categoriesList=[
    "Labs",
    "Medications",
    "Follow-up",
    "PA",
    "Message/Document",
  ]
function TaskManager() {
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selected,setSelected]=useState<string[]>([])
  const toggleCategory=(category:string)=>{
    setSelected((prev)=>
    prev.includes(category)
    ?prev.filter((c)=>c!=category):[...prev,category]
    );
  }
   const removeCategory = (category: string) => {
    setSelected((prev) => prev.filter((c) => c !== category));
  };
  const addTaskModal = async () => {
    if (modal === true) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  return (
    <>
      <div
        className={`modal bg-white rounded-xl py-7 flex flex-col gap-6 px-6 shadow-md w-1/2 ${
          modal ? "hidden" : "absolute "
        }`}
      >
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-bold gap-4">Create New Task</h1>
          <p className="text-gray-600 text-[16px]">
            Fill out the details below to create a new task for you team.
          </p>
        </div>
        <form action="" className="w-full flex flex-col gap-5">
          <div className="w-full gap-5 flex justify-center items-center">
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="title">Task Title  <span className="text-red-500 font-semibold">*</span></label>
              <input
                type="text"
                name="title"
                value={title}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter task title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="title">Patient Name  <span className="text-red-500 font-semibold">*</span></label>
              <input
                type="text"
                name="title"
                value={patientName}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter patient name ..."
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-start items-start gap-1.5">
            <label htmlFor="title">Description  <span className="text-red-500 font-semibold">*</span></label>
            <textarea
              name="title"
              value={taskDesc}
              className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
              placeholder="Enter task description..."
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col justify-start items-start gap-1.5">
           <div>
      <label className="font-semibold block mb-2">
        Categories <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {selected.map((category) => (
          <span
            key={category}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full"
          >
            {category}
            <button
              type="button"
              onClick={() => removeCategory(category)}
              className="text-gray-600 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mt-3">
        {categoriesList
          .filter((c) => !selected.includes(c))
          .map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              {category}
            </button>
          ))}
      </div>

      {/* Hidden input to submit selected values */}
      <input
        type="hidden"
        name="categories"
        value={JSON.stringify(selected)}
      />
    </div>
          </div>
        </form>
      </div>

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
      </div>
    </>
  );
}

export default TaskManager;
