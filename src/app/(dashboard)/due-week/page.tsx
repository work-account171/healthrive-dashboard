"use client";
import {
  Check,
  CheckCheckIcon,
  Download,
  Eye,
  File,
  FileText,
  Image,
  Info,
  RefreshCwIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Toaster from "@/app/components/Toaster";
import TableShimmer from "@/app/components/task-manager/TableShimmer";
import AddTaskModal from "@/app/components/task-manager/AddTaskModal";

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

type Task = {
  _id: string;
  title: string;
  patientName: string;
  description: string;
  dueDate: Date;
  services: string[];
  categories: string[];
  assignee: string;
  priority: "high" | "normal";
  updatedAt: Date;
  attachments: Attachment[];
};

export default function DisplayTask() {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 7;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dueDateFilter, setDueDateFilter] = useState<string>("All Dates");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const [modal, setModal] = useState(false);

  // Fetch tasks
  async function fetchTasks() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=false`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await res.json();
      setTasks(data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setToast({
        message: "Failed to fetch tasks",
        variant: "error",
      });
      setLoading(false);
    }
  }

  // Filters
//   const filteredTasks = tasks.filter((task) => {
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       const titleMatch = task.title.toLowerCase().includes(query);
//       const patientNameMatch = task.patientName
//         ? task.patientName.toLowerCase().includes(query)
//         : false;
//       if (!titleMatch && !patientNameMatch) return false;
//     }

//     // Due date filter
//     if (dueDateFilter !== "All Dates") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const taskDueDate = new Date(task.dueDate);
//       taskDueDate.setHours(0, 0, 0, 0);

//       if (dueDateFilter === "Due This Week") {
//         const startOfWeek = new Date(today);
//         const day = today.getDay();
//         const diff = today.getDate() - day + (day === 0 ? -6 : 1);
//         startOfWeek.setDate(diff);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         if (taskDueDate < startOfWeek || taskDueDate > endOfWeek) return false;
//       }
//     }

//     // Priority filter
   

//     return true;
//   });
const filteredTasks = tasks.filter((task) => {
  // ✅ Search filter (still works)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    const titleMatch = task.title.toLowerCase().includes(query);
    const patientNameMatch = task.patientName
      ? task.patientName.toLowerCase().includes(query)
      : false;
    if (!titleMatch && !patientNameMatch) return false;
  }

  // ✅ Always filter by "due this week"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDueDate = new Date(task.dueDate);
  taskDueDate.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Return only tasks within this week
  return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
});

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log("Tasks on current page:", currentTasks);
  }, [currentTasks]);

  async function taskDone(id: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/update/${id}`,
        {
          method: "PATCH",
        }
      );
      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
        setToast({
          message: "Task successfully marked as done!",
          variant: "success",
        });
      } else {
        throw new Error("Failed to mark task as done");
      }
    } catch (error) {
      console.error("Error marking task as done:", error);
      setToast({
        message: "Failed to mark task as done",
        variant: "error",
      });
    }
  }

  function handleDeleteClick(task: Task) {
    setSelectedTask(task);
    setShowModal(true);
  }

  function confirmDelete() {
    if (selectedTask) {
      taskDone(selectedTask._id);
      setSidebar(false);
    }
    setShowModal(false);
    setSelectedTask(null);
  }

  function cancelDelete() {
    setShowModal(false);
    setSelectedTask(null);
  }

  // const addTaskModal = () => {
  //   setModal(!modal);
  //   fetchTasks();
  // };

  return (
    <>
      {modal && <AddTaskModal />}
      {toast && (
        <Toaster
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Task Due This Week</h1>
          <p className="text-[16px] text-gray-600">
            Welcome Back, These are list of tasks which you need to done this week.
          </p>
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => fetchTasks()}
            className="bg-white cursor-pointer hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6 transition-all duration-200 hover:border-primary hover:text-primary"
            title="Refresh task list"
          >
            <RefreshCwIcon className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter search bar */}
      <div className="rounded-xl py-6 px-6 flex flex-col gap-5 border my-2 border-gray-200 bg-white shadow-sm">
        <div className="flex justify-start text-xl font-bold items-center gap-3 text-gray-800">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          Filters & Controls
        </div>
        <div className="flex justify-between items-start gap-4 w-full flex-wrap">
          <div className="py-3 px-4 flex justify-start items-center w-[70%] bg-gray-50 gap-3 rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full outline-0 bg-transparent text-gray-700 placeholder:text-gray-400"
              placeholder="Search by patient name or task.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="py-3 px-4 border border-primary text-[16px] font-semibold text-primary bg-white rounded-xl w-48 flex items-center justify-center">
            Due This Week
          </div>
          {/* <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            className="py-3 px-4 border border-gray-200 text-[16px] bg-white rounded-xl w-40"
          >
            <option value="All Dates">All Dates</option>
            <option value="Due Today">Due Today</option>
            <option value="Due This Week">Due This Week</option>
          </select> */}
          {/* <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="py-3 px-4 border border-gray-200 text-[16px] bg-white rounded-xl w-40"
          >
            <option value="All Priorities">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
          </select> */}
          {(dueDateFilter !== "All Dates" ||
            priorityFilter !== "All Priorities" ||
            searchQuery) && (
            <button
              onClick={() => {
                setDueDateFilter("All Dates");
                setPriorityFilter("All Priorities");
                setSearchQuery("");
                setCurrentPage(1); // Reset to page 1 when clearing filters
              }}
              className="py-2 px-4 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {(dueDateFilter !== "All Dates" ||
        priorityFilter !== "All Priorities" ||
        searchQuery) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-800 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {dueDateFilter !== "All Dates" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {dueDateFilter} 📅
              </span>
            )}
            {priorityFilter !== "All Priorities" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {priorityFilter} {priorityFilter === "Urgent" ? "⚠️" : "✅"}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: &quot;{searchQuery}&quot; 🔍
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          sidebar ? "translate-x-0" : "translate-x-full"
        } fixed transition-transform duration-300 ease-in-out w-full max-w-md z-50 bg-white h-screen top-0 right-0 shadow-2xl overflow-y-auto`}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={() => {
              setSidebar(false);
              setSelectedTask(null);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Title and Status Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-3xl font-bold text-gray-900 flex-1 min-w-[200px]">
                {selectedTask?.title || "Untitled Task"}
              </h1>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  Active
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    selectedTask?.priority === "high"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {selectedTask?.priority === "high" ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                      Urgent
                    </>
                  ) : (
                    "Normal"
                  )}
                </span>
              </div>
            </div>
            {selectedTask?.description && (
              <p className="text-gray-600 text-[16px] leading-relaxed">
                {selectedTask.description}
              </p>
            )}
            <button
              onClick={confirmDelete}
              className="cursor-pointer bg-primary hover:bg-[#3565a0] px-5 py-3 rounded-xl w-fit text-white flex items-center gap-2.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <CheckCheckIcon className="w-5 h-5" />
              Mark as Done
            </button>
          </div>

          {/* Task Information Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Task Information
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Assigned to</span>
                <span className="text-[16px] text-gray-900 font-semibold">
                  {selectedTask?.assignee || "Unassigned"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Deadline</span>
                <span className="text-[16px] font-semibold text-red-600">
                  {selectedTask?.dueDate
                    ? new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No deadline set"}
                </span>
              </div>
            </div>
          </div>

          {/* Other Information Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Additional Information
            </h3>
            <div className="flex flex-col gap-4">
              {selectedTask?.categories && selectedTask.categories.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-500">Task Categories</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedTask?.services && selectedTask.services.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-500">Linked Services</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.services.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Attachments
            </h3>
            <div className="flex flex-col gap-3">
              {selectedTask?.attachments && selectedTask.attachments.length > 0 ? (
                selectedTask.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {attachment.type.includes("pdf") ? (
                        <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                      ) : attachment.type.includes("image") ? (
                        <Image className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      ) : (
                        <File className="w-6 h-6 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(attachment.size / 1024)} KB •{" "}
                          {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(attachment.url, "_blank")}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors ml-2 flex-shrink-0"
                      title="Download file"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4 text-center">
                  No files attached to this task
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Display tasks table */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Status
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-primary transition-colors" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded-md shadow-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">
                        Urgent tasks have higher priority
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
          {loading ? (
            <TableShimmer />
          ) : (
            <>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-lg font-medium">No tasks found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters or add a new task</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-gray-50/80 text-[15px] transition-all duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{task.title || "—"}</td>
                      <td className="px-6 py-4 text-gray-700">{task.patientName || "—"}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{task.assignee || "—"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {task.priority === "high" ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                              Urgent
                            </>
                          ) : (
                            "Normal"
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => handleDeleteClick(task)}
                            className="bg-green-600 hover:bg-green-700 group relative rounded-lg text-white p-2.5 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Mark as done"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSidebar(true);
                              setSelectedTask(task);
                            }}
                            className="bg-primary hover:bg-[#3565a0] rounded-lg text-white p-2.5 group relative transition-all duration-200 shadow-sm hover:shadow-md"
                            title="View task details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-6 py-5 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center flex-col gap-4">
                      <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{indexOfFirstTask + 1}</span> to{" "}
                        <span className="font-semibold text-gray-900">
                          {Math.min(indexOfLastTask, filteredTasks.length)}
                        </span>{" "}
                        of <span className="font-semibold text-gray-900">{filteredTasks.length}</span> tasks
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200 font-medium text-gray-700 disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                        >
                          « Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 min-w-[40px] border rounded-lg transition-all duration-200 font-medium ${
                              currentPage === i + 1
                                ? "bg-primary text-white border-primary shadow-md"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200 font-medium text-gray-700 disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </>
          )}
          </table>
        </div>
      </div>

      {/* Modal for marking task as done */}
      {showModal && (
        <div className="absolute top-10 right-10 z-50 border transition-all duration-500 ease-out opacity-100 translate-y-0 border-primary bg-white p-3 rounded-xl shadow-md">
          <p>
            Are you sure you want to mark this &apos;{selectedTask?.title}&apos; task done?
          </p>
          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={confirmDelete}
              className="bg-primary w-full text-white hover:bg-red-500 px-4 py-2 rounded-lg cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-300 hover:bg-gray-400 w-full px-4 py-2 rounded-lg cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}