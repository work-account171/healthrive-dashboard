"use client";
import { Upload, X } from "lucide-react";
import React, { useState } from "react";
import { useRef } from "react";
import Toaster from "../Toaster";

const categoriesList = [
  "Labs",
  "Medications",
  "Follow-up",
  "PA",
  "Message/Document",
];
const linkedServices = ["Healthie", "Spruce", "CoverMyMeds", "Google Calender"];
function AddTaskModal() {
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [recurrance, setRecurrence] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ Typed correctly
const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  const toggleServices = (services: string) => {
    setServices((prev) =>
      prev.includes(services)
        ? prev.filter((s) => s != services)
        : [...prev, services]
    );
  };
  const removeServices = (services: string) => {
    setServices((prev) => prev.filter((s) => s !== services));
  };
  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c != category)
        : [...prev, category]
    );
  };
  const removeCategory = (category: string) => {
    setSelected((prev) => prev.filter((c) => c !== category));
  };
  const handleModal = () => {
    if (modal == true) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    

    const newTask = {
      title,
      description: taskDesc,
      patientName,
      completed:false,
      categories: selected,
      assignee: selectedAssignee,
      dueDate,
      services,
      priority,
      recurrence: recurrance,
    };
    console.log('Data being sent to backend:', newTask);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/add-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅
        body: JSON.stringify(newTask),
      });

      const data = await res.json();
      console.log("saved task", data);
      if (res.ok && data.success) {
        setModal(true);
        setToast({ 
        message: "Task successfully added", 
        variant: "success" 
      });
      }
    } catch (error: unknown) {
      console.error("error while adding task", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {toast && (
          <Toaster
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}
      <div
        className={`modal bg-white rounded-xl overflow-y-scroll scrollbar-none h-screen border border-gray-200 py-7 flex flex-col gap-6 px-6 shadow-md w-1/2 ${
          !modal ? "absolute top-2" : "hidden"
        }`}
      >
        <X
          className="absolute top-3 right-3 border rounded-full p-1 cursor-pointer font-bold hover:text-red-500"
          onClick={handleModal}
        />
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-bold gap-4">Create New Task</h1>
          <p className="text-gray-600 text-[16px]">
            Fill out the details below to create a new task for you team.
          </p>
        </div>
        <form
          onSubmit={(e) => addTask(e)}
          className="w-full flex flex-col gap-5"
        >
          <div className="w-full gap-5 flex justify-center items-center">
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="title">
                Task Title <span className="text-red-500 font-semibold">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter task title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="title">
                Patient Name (optional)
                
              </label>
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
            <label htmlFor="title">
              Description <span className="text-red-500 font-semibold">*</span>
            </label>
            <textarea
              name="title"
              value={taskDesc}
              required
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

              <input
                type="hidden"
                name="categories"
                required
                value={JSON.stringify(selected)}
              />
            </div>
          </div>
          <div className="w-full gap-5 flex justify-center items-center">
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="assignee">
                Assign to <span className="text-red-500 font-semibold">*</span>
              </label>
              <select
                name="assignee"
                id="assignee"
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
                required
              >
                <option value="" disabled>
                  Select Assignee
                </option>
                <option value="Virtual Assistant">Virtual Assistant</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Billing Team">Billing Team</option>
                <option value="Pharmacy Team">Pharmacy Team</option>
              </select>
            </div>
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="title">
                Due Date
                <span className="text-red-500 font-semibold">*</span>
              </label>

              <input
                type="date"
                name="dueDate"
                id="dueDate"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
                 min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="w-full gap-5 flex justify-center items-center">
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="assignee">
                Priority <span className="text-red-500 font-semibold">*</span>
              </label>
              <select
                name="priority"
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
                required
              >
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="assignee">Recurrence</label>
              <select
                name="recurrance"
                id="recurrance"
                value={recurrance}
                onChange={(e) => setRecurrence(e.target.value)}
                className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
                required
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex w-full flex-col justify-start items-start gap-1.5">
            <div>
              <label className="font-semibold block mb-2">
                Linked Services <span className="text-red-500">*</span>
              </label>

              {/* Selected Services */}
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <span
                    key={service}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeServices(service)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Options to Add */}
              <div className="flex flex-wrap gap-2 mt-3">
                {linkedServices
                  .filter((s) => !services.includes(s))
                  .map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleServices(service)}
                      className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      {service}
                    </button>
                  ))}
              </div>

              <input
                type="hidden"
                name="services"
                value={JSON.stringify(services)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="attachments" className="font-semibold text-sm">
              Attachments
            </label>

            <div
              className="flex flex-col justify-center items-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-gray-500 transition"
              onClick={handleClick}
            >
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, JPG, PNG
              </p>

              <input
                type="file"
                name="attachments"
                id="attachments"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Uploaded files:</p>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name}{" "}
                      <span className="text-gray-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end items-end gap-5">
            <button
              className="py-4 px-6 text-primary border border-primary rounded-xl hover:bg-red-200"
              onClick={handleModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-4 px-6 border border-primary rounded-xl bg-primary hover:bg-white hover:text-primary text-white"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTaskModal;
