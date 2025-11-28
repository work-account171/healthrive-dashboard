"use client";
import ConfirmationModal from "@/app/components/confirmModal";
import TableShimmer from "@/app/components/task-manager/TableShimmer";
import Toaster from "@/app/components/Toaster";
import { Download, Eye, File, FileText, Image, Trash, Undo2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

type Tasks = {
  _id: string;
  title: string;
  patientName: string;
  description: string;
  services: string[];
  categories: string[];
  dueDate: string;
  assignee: string;
  priority: "high" | "normal";
  attachments: Attachment[];
};

function CompletedTask() {
  const [completedTasks, setCompletedTasks] = useState<Tasks[]>([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Yes",
    confirmColor: "primary" as "primary" | "danger" | "success",
  });
  const [sidebar, setSidebar] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "warning" } | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch tasks and safely extract array
  async function fetchTasks() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=true`);
      const data = await res.json();
      setCompletedTasks(data.tasks || []); // ✅ only set the array
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
      setToast({ message: "Failed to load tasks", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Mark incomplete
  function handleIncomplete(task: Tasks) {
    setModalConfig({
      isOpen: true,
      title: "Mark Task Incomplete",
      message: `Are you sure you want to mark '${task.title}' as incomplete?`,
      onConfirm: () => updateStatus(task._id),
      confirmText: "Yes, Mark Incomplete",
      confirmColor: "primary",
    });
  }

  // ✅ Delete confirmation
  function handleDelete(task: Tasks) {
    setModalConfig({
      isOpen: true,
      title: "Delete Task",
      message: `Are you sure you want to delete '${task.title}'? This action cannot be undone.`,
      onConfirm: () => deleteTask(task._id),
      confirmText: "Yes, Delete",
      confirmColor: "danger",
    });
  }

  async function updateStatus(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/update/${id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      setCompletedTasks((prev) => prev.filter((task) => task._id !== id));
      setToast({ message: "Task successfully marked as incomplete!", variant: "success" });
      setSidebar(false);
      closeModal();
    }
  }

  async function deleteTask(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/delete/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setToast({ message: "Task deleted successfully!", variant: "success" });
      setSidebar(false);
      closeModal();
      fetchTasks();
    }
  }

  function closeModal() {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <>
      {toast && (
        <Toaster message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
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
        {selectedTask && (
          <div className="p-6 flex flex-col gap-6">
            {/* Title and Status Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-3xl font-bold text-gray-900 flex-1 min-w-[200px]">
                  {selectedTask.title}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    Completed
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedTask.priority === "high"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedTask.priority === "high" ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                        Urgent
                      </>
                    ) : (
                      "Normal"
                    )}
                  </span>
                </div>
              </div>
              {selectedTask.description && (
                <p className="text-gray-600 text-[16px] leading-relaxed">
                  {selectedTask.description}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleIncomplete(selectedTask)}
                  className="cursor-pointer bg-primary hover:bg-[#3565a0] px-5 py-3 rounded-xl w-fit text-white flex items-center gap-2.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Undo2 className="w-5 h-5" />
                  Undo Complete
                </button>
                <button
                  onClick={() => handleDelete(selectedTask)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl w-fit text-white flex items-center gap-2.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Trash className="w-5 h-5" />
                  Delete Task
                </button>
              </div>
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
                    {selectedTask.assignee || "Unassigned"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Deadline</span>
                  <span className="text-[16px] font-semibold text-red-600">
                    {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
                {selectedTask.categories && selectedTask.categories.length > 0 && (
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
                {selectedTask.services && selectedTask.services.length > 0 && (
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
                {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
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
        )}
      </div>

      {/* Main Table */}
      <div className="flex flex-col justify-start items-start gap-6">
        <div className="flex justify-between items-center w-full mb-6">
          <div className="flex flex-col gap-4 justify-start items-start">
            <h1 className="text-[32px] font-bold">Completed Tasks</h1>
            <p className="text-[16px] text-gray-600">Good work! These are the tasks you completed so far.</p>
          </div>
        </div>

        <div className="w-full">
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
                      Status
                    </th>
                    <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <TableShimmer />
                ) : (
                  <tbody className="bg-white divide-y divide-gray-100">
                    {completedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <p className="text-gray-500 text-lg font-medium">No completed tasks found</p>
                            <p className="text-gray-400 text-sm">Complete some tasks to see them here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      completedTasks.map((task, index) => (
                        <tr
                          key={index}
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
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              Completed
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 items-center justify-center">
                              <button
                                onClick={() => handleIncomplete(task)}
                                className="bg-orange-600 hover:bg-orange-700 group relative rounded-lg text-white p-2.5 transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Mark as incomplete"
                              >
                                <Undo2 className="w-4 h-4" />
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
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
      />
    </>
  );
}

export default CompletedTask;
