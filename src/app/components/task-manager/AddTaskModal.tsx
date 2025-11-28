
"use client";
import { Download, Trash2, Upload, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useAppStore } from '../../stores/useAppStore';

const categoriesList = [
  "Labs",
  "Medications",
  "Follow-up",
  "PA",
  "Message/Document",
];

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface Patient {
  _id: string;
  name: string;
}

const linkedServices = ["Healthie", "Spruce", "CoverMyMeds", "Google Calendar"];

function AddTaskModal() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
  const [uploadStatus, setUploadStatus] = useState<
    Record<
      string,
      {
        status: "pending" | "uploading" | "success" | "error";
        message: string;
        url?: string;
      }
    >
  >({});

  const { addNotification } = useAppStore();

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/get-patients`
      );
      const data = await res.json();
      if (res.ok) {
        setPatients(data);
      } else {
        addNotification({
          message: "Failed to fetch patients",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      addNotification({
        message: "Error fetching patients",
        type: "error",
      });
    }
  }

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAll = async () => {
    const uploadPromises = selectedFiles.map((file) => uploadFileToServer(file));

    try {
      setUploadStatus((prev) => {
        const newStatus = { ...prev };
        selectedFiles.forEach((file) => {
          newStatus[file.name] = { status: "uploading", message: "Uploading..." };
        });
        return newStatus;
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...results]);
      setSelectedFiles([]);
      addNotification({
        message: "Files uploaded successfully",
        type: "success",
      });
    } catch (error) {
      addNotification({
        message: "Some files failed to upload",
        type: "error",
      });
      console.error("Upload error:", error);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const downloadFile = (file: UploadedFile) => {
    window.open(file.url, "_blank");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    const status: Record<
      string,
      { status: "pending" | "uploading" | "success" | "error"; message: string }
    > = {};
    files.forEach((file) => {
      status[file.name] = { status: "pending", message: "Ready to upload" };
    });
    setUploadStatus(status);
  };

  const uploadFileToServer = async (file: File): Promise<UploadedFile> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/file-upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setUploadStatus((prev) => ({
          ...prev,
          [file.name]: { status: "error", message: "Upload failed" },
        }));
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        setUploadStatus((prev) => ({
          ...prev,
          [file.name]: { status: "error", message: "Upload failed" },
        }));
        throw new Error("Upload failed");
      }

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { status: "success", message: "Uploaded successfully", url: data.url },
      }));

      return {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: data.url,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { status: "error", message: "Upload error" },
      }));
      console.error("Upload error:", error);
      throw error;
    }
  };

  const toggleServices = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const removeServices = (service: string) => {
    setServices((prev) => prev.filter((s) => s !== service));
  };

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelected((prev) => prev.filter((c) => c !== category));
  };

  const handleModal = () => {
    setModal((prev) => !prev);
    if (modal) {
      setTitle("");
      setPatientName("");
      setTaskDesc("");
      setSelected([]);
      setServices([]);
      setSelectedAssignee("");
      setDueDate("");
      setPriority("");
      setRecurrence("");
      setSelectedFiles([]);
      setUploadedFiles([]);
      setUploadStatus({});
    }
  };

 const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const newTask = {
    title,
    description: taskDesc,
    patientName,
    completed: false,
    categories: selected,
    assignee: selectedAssignee,
    dueDate,
    services,
    priority,
    recurrence: recurrance,
    attachments: uploadedFiles,
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/add-task`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      }
    );

    const data = await res.json();
    console.log("saved task", data);

    if (res.ok && data.success) {
      // Add notification for Header
      addNotification({
        message: `New Task Added: "${title}" for ${patientName || "Unknown Patient"}`,
        type: "success",
      });

      // Show success toast / notification
      addNotification({
        message: `Task "${title}" successfully added`,
        type: "success",
      });

      handleModal(); // Close modal and reset form
    } else {
      addNotification({
        message: "Failed to add task",
        type: "error",
      });
    }
  } catch (error: unknown) {
    console.error("Error while adding task:", error);
    addNotification({
      message: "Error adding task",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {!modal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-20 flex items-center justify-center">
          <div
            className="modal z-20 bg-white rounded-xl overflow-y-scroll scrollbar-none border border-gray-200 py-7 flex flex-col gap-6 px-6 shadow-2xl w-1/2 max-h-[90vh]"
          >
      <X
        className="absolute top-3 right-3 border rounded-full p-1 cursor-pointer font-bold hover:text-red-500"
        onClick={handleModal}
      />
      <div className="flex flex-col justify-start items-start gap-4">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        <p className="text-gray-600 text-[16px]">
          Fill out the details below to create a new task for your team.
        </p>
      </div>
      <form onSubmit={addTask} className="w-full flex flex-col gap-5">
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
          <div className="flex w-full flex-col justify-start items-start gap-1.5 relative">
            <label htmlFor="patientName">Select Patient</label>
            <input
              type="text"
              name="patientName"
              value={patientName}
              className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
              placeholder="Enter patient name ..."
              onChange={(e) => {
                setPatientName(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg z-10">
                {patients
                  .filter((p) =>
                    p.name.toLowerCase().includes(patientName.toLowerCase())
                  )
                  .map((p) => (
                    <li
                      key={p._id}
                      className="px-5 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setPatientName(p.name);
                        setShowDropdown(false);
                      }}
                    >
                      {p.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col justify-start items-start gap-1.5">
          <label htmlFor="description">
            Description <span className="text-red-500 font-semibold">*</span>
          </label>
          <textarea
            name="description"
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
            </select>
          </div>
          <div className="flex w-full flex-col justify-start items-start gap-1.5">
            <label htmlFor="dueDate">
              Due Date <span className="text-red-500 font-semibold">*</span>
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
            <label htmlFor="priority">
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
              <option value="">Select Priority</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* <div className="flex w-full flex-col justify-start items-start gap-1.5">
            <label htmlFor="recurrance">Recurrence</label>
            <select
              name="recurrance"
              id="recurrance"
              value={recurrance}
              onChange={(e) => setRecurrence(e.target.value)}
              className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
            >
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div> */}
        </div>
        {/* <div className="flex w-full flex-col justify-start items-start gap-1.5">
          <div>
            <label className="font-semibold block mb-2">
              Linked Services <span className="text-red-500">*</span>
            </label>
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
        </div> */}
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
              <p className="text-sm font-medium mb-2">Files to upload:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-gray-400 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      {uploadStatus[file.name] && (
                        <span
                          className={`ml-3 text-xs ${
                            uploadStatus[file.name].status === "success"
                              ? "text-green-600"
                              : uploadStatus[file.name].status === "error"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {uploadStatus[file.name].message}; please click upload
                          files button before adding task
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleUploadAll}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Upload All Files
              </button>
            </div>
          )}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Uploaded files:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between bg-green-50 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-gray-400 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Download file"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end items-end gap-5">
          <button
            className="py-4 px-6 text-primary border border-primary rounded-xl hover:text-red-600 hover:border-red-600"
            onClick={handleModal}
            type="button"
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
        </div>
      )}
    </>
  );
}

export default AddTaskModal;
