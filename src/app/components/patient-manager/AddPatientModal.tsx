"use client"
import { Download, Trash2, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import Toaster from "../Toaster";


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
const linkedServices = ["Healthie", "Spruce", "CoverMyMeds", "Google Calender"];
const AddPatientModal=()=> {
      const [name, setName] = useState("");
      const [carePhase,setCarePhase]=useState("")
      const [patientDesc, setPatientDesc] = useState("");
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
    
      const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
      const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ Typed correctly
      const [toast, setToast] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
      } | null>(null);
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
          console.log(error)
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
        // You might also want to call an API to delete the file from Cloudflare
      };
    
      const downloadFile = (file: UploadedFile) => {
        // For public files, we can directly use the URL
        window.open(file.url, "_blank");
      };
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    
        // Reset upload status for new files
        const status: Record<
          string,
          { status: "pending" | "uploading" | "success" | "error"; message: string }
        > = {};
        files.forEach((file) => {
          status[file.name] = { status: "pending", message: "Ready to upload" };
        });
        setUploadStatus(status);
      };
      // This approach requires CORS to be configured on your R2 bucket
      const uploadFileToServer = async (file: File): Promise<UploadedFile> => {
        try {
          // Create form data
          const formData = new FormData();
          formData.append("file", file);
    
          // Upload through our API route
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
    
      
      const addPatient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
    
        const newPatient = {
          name:name,
          description: patientDesc,
          carePhase,
          categories: selected,
          assignee: selectedAssignee,
          dueDate,
          services,
          priority,
          recurrence: recurrance,
          attachments: uploadedFiles, // Include uploaded files
        };
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/add-patient`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" }, // ✅
              body: JSON.stringify(newPatient),
            }
          );
    
          const data = await res.json();
          console.log("saved patient", data);
          if (res.ok && data.success) {
            setModal(true);
            setToast({
              message: "Patient successfully added",
              variant: "success",
            });
          }
        } catch (error: unknown) {
          console.error("error while adding patinets", error);
        } finally {
          setLoading(false);
        }
      };
    const [modal,setModal]=useState(false)
    function handleModal(){
        if(modal===true){
            setModal(false)
        }else{
            setModal(true)
        }
    }

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
        className={`modal z-20 bg-white rounded-xl left-1/2 transform -translate-x-1/2 overflow-y-scroll scrollbar-none h-screen border border-gray-200 py-7 flex flex-col gap-6 px-6 shadow-md w-1/2 ${
          !modal ? "absolute top-2" : "hidden"
        }`}
      >
        <X
          className="absolute top-3 right-3 border rounded-full p-1 cursor-pointer font-bold hover:text-red-500"
          onClick={handleModal}
        />
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-bold gap-4">Add New Patient</h1>
          <p className="text-gray-600 text-[16px]">
            Fill out the details below to add a new patient for you team.
          </p>
        </div>
        <form
          onSubmit={(e) => addPatient(e)}
          className="w-full flex flex-col gap-5"
        >
          <div className="w-full gap-5 flex justify-center items-center">
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="name">
                Patient Name 
              </label>
              <input
                type="text"
                name="name"
                required
                value={name}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter Patient Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              <label htmlFor="carePhase">Care Phase <span className="text-red-500 font-semibold">*</span></label>
              <input
                type="text"
                name="carePhase"
                required
                value={carePhase}
                className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
                placeholder="Enter Care Phase i.e  ongoing, new care, stable"
                onChange={(e) => setCarePhase(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-start items-start gap-1.5">
            <label htmlFor="patientDesc">
              Description <span className="text-red-500 font-semibold">*</span>
            </label>
            <textarea
              name="patientDesc"
              value={patientDesc}
              required
              className="py-4 px-5 w-full bg-gray-100 placeholder:text-gray-600 rounded-xl"
              placeholder="Enter patient description..."
              onChange={(e) => setPatientDesc(e.target.value)}
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
              <label htmlFor="dueDate">
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
                <option value="">Select Priority</option>
                <option value="safe">Normal</option>
                <option value="emergency">Emergency</option>
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
                            {uploadStatus[file.name].message} ;please first
                            click upload files button below before adding tasks
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

            {/* Already uploaded files */}
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
              {loading ? "Adding..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
          </>

  )
}

export default AddPatientModal