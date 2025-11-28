"use client"
import { Download, Trash2, Upload, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Toaster from "../Toaster";
import { useRouter } from 'next/navigation';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

type Patient = {
  _id: string;
  name: string;
  clientId: string;
  firstName: string;
  lastName: string;
  description: string;
  phNumber: string;
  email: string;
  priority: "emergency" | "safe";
  attachments: UploadedFile[];
};

interface EditPatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPatientModal = ({ patient, onClose, onSuccess }: EditPatientModalProps) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [clientId, setclientId] = useState("");
  const [patientDesc, setPatientDesc] = useState("");
  const [priority, setPriority] = useState<"safe" | "emergency">("safe");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phNumber, setphNumber] = useState("");
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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  
  const router = useRouter();

  // Pre-fill form when patient prop changes
  useEffect(() => {
    if (patient) {
      setfirstName(patient.firstName || "");
      setlastName(patient.lastName || "");
      setclientId(patient.clientId || "");
      setPatientDesc(patient.description || "");
      setPriority(patient.priority || "safe");
      setEmail(patient.email || "");
      setphNumber(patient.phNumber || "");
      setUploadedFiles(patient.attachments || []);
    }
  }, [patient]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAll = async () => {
    const uploadPromises = selectedFiles.map((file) =>
      uploadFileToServer(file)
    );

    try {
      const results = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...results]);
      setSelectedFiles([]);
      setToast({
        message: "Files uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      setToast({
        message: "Some files failed to upload",
        variant: "error",
      });
      console.log(error);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/file-upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Upload failed");
      }

      return {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: data.url,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const updatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patient) return;

    setLoading(true);

    const updatedPatient = {
      clientId,
      name: firstName + " " + lastName,
      firstName,
      lastName,
      description: patientDesc,
      email,
      phNumber,
      priority,
      attachments: uploadedFiles,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/update/${patient._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPatient),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          message: "Patient successfully updated",
          variant: "success",
        });
        onSuccess();
        onClose();
        router.refresh();
      } else {
        setToast({
          message: data.message || "Failed to update patient",
          variant: "error",
        });
      }
    } catch (error: unknown) {
      console.error("error while updating patient", error);
      setToast({
        message: "Failed to update patient",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-20 flex items-center justify-center">
        <div className="modal z-20 bg-white rounded-xl overflow-y-scroll scrollbar-none border border-gray-200 py-7 flex flex-col gap-6 px-6 shadow-2xl w-1/2 max-h-[90vh]">
          <X
            className="absolute top-3 right-3 border rounded-full p-1 cursor-pointer font-bold hover:text-red-500"
            onClick={onClose}
          />
          <div className="flex flex-col justify-start items-start gap-4">
            <h1 className="text-2xl font-bold gap-4">Edit Patient</h1>
            <p className="text-gray-600 text-[16px]">
              Update the patient details below.
            </p>
          </div>
          <form
            onSubmit={(e) => updatePatient(e)}
            className="w-full flex flex-col gap-5"
          >
            <div className="w-full gap-5 flex justify-center items-center">
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="clientId">clientID</label>
                <input
                  type="text"
                  name="clientId"
                  value={clientId}
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Client Id"
                  onChange={(e) => setclientId(e.target.value)}
                />
              </div>
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="name">
                  Full Name <span className="italic text-gray-600">automated generated</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={firstName + " " + lastName}
                  disabled
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Patient full Name"
                />
              </div>
            </div>
            <div className="w-full gap-5 flex justify-center items-center">
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Patient's first Name"
                  onChange={(e) => setfirstName(e.target.value)}
                />
              </div>
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={lastName}
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Patient's last Name"
                  onChange={(e) => setlastName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="patientDesc">
                Description <span className="italic">(optional)</span>
              </label>
              <textarea
                name="patientDesc"
                value={patientDesc}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter Patient Description..."
                onChange={(e) => setPatientDesc(e.target.value)}
              />
            </div>
            <div className="w-full gap-5 flex justify-center items-center">
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="email">email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Patient's email if any"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="phNumber">
                  Phone Number <span className="italic">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phNumber"
                  value={phNumber}
                  className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                  placeholder="Enter Patient's Phone Number if any"
                  onChange={(e) => setphNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full gap-5 flex justify-center items-center">
              <div className="flex w-full flex-col justify-start items-start gap-1.5">
                <label htmlFor="priority">
                  Priority <span className="italic">(optional)</span>
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "safe" | "emergency")}
                  className="py-4 px-5 w-full bg-gray-100 text-gray-600 rounded-xl"
                >
                  <option value="safe">Normal</option>
                  <option value="emergency">Emergency</option>
                </select>
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

              {/* Selected files waiting to be uploaded */}
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
                              {uploadStatus[file.name].message}; please first
                              click upload files button below before updating
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

              {/* Already uploaded files (existing + newly uploaded) */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Attached files:</p>
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
                type="button"
                className="py-4 px-6 text-primary border border-primary hover:border-red-600 rounded-xl hover:text-red-600 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-4 px-6 border border-primary rounded-xl bg-primary hover:bg-white hover:text-primary text-white cursor-pointer"
              >
                {loading ? "Updating..." : "Update Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPatientModal;

