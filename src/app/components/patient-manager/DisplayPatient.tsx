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
  Plus,
  RefreshCwIcon,
  Search,
  SlidersHorizontalIcon,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddPatientModal from "./AddPatientModal";
import Toaster from "../Toaster";
import TableShimmer from "../task-manager/TableShimmer";
import ConfirmationModal from "../confirmModal";
import { tr } from "date-fns/locale";

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

type Patient = {
  _id: string;
  name: string;
  description: string;
  phNumber:string;
  email:string;
  carePhase:string;
  priority: "emergency" | "safe";
  updatedAt: Date;
  attachments: Attachment[];
};

function DisplayPatient() {
  const [modal, setModal] = useState(false);
  const [patient, setPatient] = useState<Patient[]>([]);
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("All Dates");
  const [priorityFilter, setPriorityFilter] =
    useState<string>("All Priorities");

  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

    const [modalConfig, setModalConfig] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: () => void;
      confirmText?: string;
      confirmColor?: "primary" | "danger" | "success";
    }>({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      confirmText: "Yes",
      confirmColor: "primary",
    });

  const addPatientModal = async () => {
    if (modal === true) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  const filteredPatients = patient.filter((patient) => {
    if (searchQuery.trim()) {
      console.log("patietns are: " + patient);
      const query = searchQuery.toLowerCase();
      const titleMatch = patient.name.toLowerCase().includes(query);
      const patientNameMatch = patient.name
        ? patient.name.toLowerCase().includes(query)
        : false;

      if (!titleMatch && !patientNameMatch) return false;
    }
    if (priorityFilter !== "All Priorities") {
      if (priorityFilter === "emergency" && patient.priority !== "emergency")
        return false;
      if (priorityFilter === "safe" && patient.priority !== "safe")
        return false;
    }

    return true;
  });
  async function fetchPatients() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/get-patients`
    );
    const data = await res.json();
    console.log(data);
    setPatient(data);
    if (res.ok) {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPatients();
  }, []);
  function handleDeleteClick(patient: Patient) {
    setSelectedPatient(patient);
    if (showModal === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }

  function confirmDelete(patient:Patient) {
    if (selectedPatient) {
      console.log(selectedPatient)
      setModalConfig({
        isOpen:true,
        title:"Delete",
        message:"Are you sure you want to delete the patient?, This action can't be undone",
        onConfirm:()=>deletePatient(patient._id),
        confirmText:"yes, Delete",
        confirmColor:"danger"

      })

    }
    setShowModal(false);
    setSelectedPatient(null);
  }
  async function deletePatient(id:string){
    try {
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/delete-patient/${id}`,{
        method:"DELETE"
      })
      if(res.ok){
        setToast({message:"patient deleted successfully",variant:"success"})
        setSidebar(false);
        closeModal();
        fetchPatients();
            }
    } catch (error) {
      setToast({message:"failed to delete patient",variant:"error"})
      console.log(error)
    }
      
      
  }
  function cancelDelete() {
    setShowModal(false);
    setSelectedPatient(null);
  }
  function closeModal() {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }
  function handleDelete(patient:Patient){
    setModalConfig({
      isOpen: true,
      title: "Delete Task",
      message: `Are you sure you want to delete '${patient.name}'? This action cannot be undone.`,
      onConfirm: () => deletePatient(patient._id),
      confirmText: "Yes, Delete",
      confirmColor: "danger",
    });
  }

  return (
    <>
      {modal ? <AddPatientModal /> : ""}
      {toast && (
        <Toaster
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      {/* sidebar here.... */}
      <div
        className={`sidebar ${
          sidebar ? "translate-x-0" : "translate-x-full"
        } fixed transition-transform duration-300 ease-in-out w-1/3 z-10 p-8 flex flex-col gap-6 border border-primary bg-white h-screen top-0 right-0`}
      >
        <button
          onClick={() => {
            setSidebar(false);
            setSelectedPatient(null);
          }}
          className="p-2 rounded-md border text-primary border-primary absolute top-6 right-6"
        >
          <X />
        </button>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <h1 className="text-4xl font-bold">{selectedPatient?.name}</h1>
            <p className="bg-green-200 rounded-xl text-green-500 px-2.5 py-1.5">
              Active
            </p>
            <p
              className={` rounded-xl ${
                selectedPatient?.priority == "emergency"
                  ? "bg-red-600"
                  : "bg-yellow-300"
              } text-white  px-2.5 py-1.5`}
            >
              {selectedPatient?.priority == "emergency" ? "emergency" : "safe"}
            </p>
          </div>
          <p className="text-gray-600 text-[16px]">{selectedPatient?.description}</p>
          <button
            onClick={()=>selectedPatient && handleDelete(selectedPatient)}
            className="cursor-pointer bg-red-600 px-4 py-2 rounded-xl w-fit text-white flex gap-2 5"
          >
            <Trash/>
            Delete Patient
          </button>
        </div>
        <div className="rounded-xl border border-gray-300 p-4 flex flex-col gap-2.5 text-primary w-full">
          <h1 className="text-black text-xl">Patient Information</h1>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] ">
              email: {""}
              <a href={`mailto:${selectedPatient?.email}`} className="underline">{selectedPatient?.email}</a>
            </h1>
            <h1 className="text-[16px]">
              contact no: {""}
              <span className="font-semibold text-red-500">
                    {selectedPatient?.phNumber}
              </span>
            </h1>
          </div>
        </div>
        <div className="rounded-xl border border-gray-300 p-4 flex flex-col gap-2.5 w-full">
          <h1 className="text-black text-xl">Other Information</h1>
           <div className="text-[16px]">
              Patient's description: {""}
              <span className="font-semibold">
                    {selectedPatient?.description}
              </span>
            </div>
        </div>
        <div className="rounded-xl border border-gray-300 p-4 flex flex-col gap-2.5 w-full">
          <h1 className="text-black text-xl">Attachments</h1>
          <div className="flex flex-col gap-3">
            {selectedPatient?.attachments &&
            selectedPatient.attachments.length > 0 ? (
              selectedPatient.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    {/* File icon based on type */}
                    {attachment.type.includes("pdf") ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : attachment.type.includes("image") ? (
                      <Image className="w-5 h-5 text-blue-500" />
                    ) : (
                      <File className="w-5 h-5 text-gray-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
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
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No files attached to this task
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Patient Management</h1>
          <p className="text-[16px]">
            View, filter, and manage all patient records with task-linked
            insights and care phase tracking.
          </p>
        </div>
        <button
          onClick={addPatientModal}
          className="bg-primary  cursor-pointer hover:bg-white hover:text-primary border border-primary text-white text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6"
        >
          <Plus />
          Add Patient
        </button>
      </div>
      <div className="rounded-xl py-6 px-5 flex flex-col gap-5 border my-6 border-gray-100">
        <div className="flex justify-start text-2xl font-bold items-center gap-3.5">
          <SlidersHorizontalIcon />
          Filters & Controls
        </div>
        <div className="flex justify-start items-start gap-6 w-full">
          <div className="py-3 px-4 flex justify-start items-center w-full bg-gray-100 gap-2.5 rounded-xl border border-gray-200 ">
            <Search />
            <input
              type="text"
              className="w-full outline-0"
              placeholder="Search by patient name"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
         
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="py-3 px-4  text-[16px] border border-gray-200 text-sm bg-white rounded-xl w-40"
          >
            <option value="All Priorities">All Cases</option>
            <option value="emergency">Emergency</option>
            <option value="safe">Safe</option>
          </select>
          {(dueDateFilter !== "All Dates" ||
            priorityFilter !== "All Priorities" ||
            searchQuery) && (
            <button
              onClick={() => {
                setDueDateFilter("All Dates");
                setPriorityFilter("All Priorities");
                setSearchQuery("");
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
          <p className="text-sm font-medium text-blue-800 mb-2">
            Active Filters:
          </p>
          <div className="flex flex-wrap gap-2">
            {dueDateFilter !== "All Dates" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {dueDateFilter} 📅
              </span>
            )}
            {priorityFilter !== "All Priorities" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {priorityFilter} {priorityFilter === "emergency" ? "🚨" : "✅"}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: &quot;{searchQuery}&quot;🔍
              </span>
            )}
          </div>
        </div>
      )}

      {/* patients table starts from here  */}
      <div className="rounded-xl relative">
        <div
          className="absolute top-5 right-5 z-5 text-black group"
          onClick={() => fetchPatients()}
        >
          <RefreshCwIcon />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
            Refresh
          </span>
        </div>
        <table className="min-w-full rounded-xl text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 rounded-xl text-black font-medium  text-[16px]">
            <tr>
              <th className="px-6 py-5">Patient Name</th>
              <th className="px-6 py-5">Care Phase</th>
              <th className="px-6 py-5">Ph. Number</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  Status
                  <div className="relative group">
                    {/* Lucide Info Icon */}
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-white text-sm text-primary rounded-md shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-5 whitespace-nowrap">
                      Patients in emergency have higher priority
                    </div>
                  </div>
                </div>
              </th>
              <th className="pl-28 py-5">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableShimmer />
          ) : (
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPatients?.map((patient, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-[16px] transition duration-150"
                >
                  <td className="px-6 py-4">{patient.name}</td>
                  <td className="px-6 py-4">{patient.carePhase}</td>
                  <td className="px-6 py-4">
                    {patient.phNumber}
                  </td>
                  <td className="px-6 py-4">{patient.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-2.5 rounded-xl font-medium ${
                        patient.priority === "emergency"
                          ? "bg-red-400 text-white"
                          : patient.priority === "safe"
                          ? "bg-yellow-400 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {`${
                        patient.priority === "emergency"
                          ? "Emergency 🚨"
                          : "Safe"
                      }`}
                    </span>
                  </td>
                  <td className="pl-6 py-4 ">
                    <div className="flex gap-3 items-center  justify-center">
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="bg-green-500 group relative rounded-lg text-white p-2 cursor-pointer"
                      >
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
                          Mark as done
                        </span>
                        <Check />
                      </button>

                      <button
                        onClick={() => {
                          setSidebar(true);
                          setSelectedPatient(patient);
                        }}
                        className="bg-primary rounded-lg text-white p-2 group relative"
                      >
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
                          View
                        </span>
                        <Eye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {showModal && (
        <div className="absolute top-10 right-10 z-50  border transition-all duration-500 ease-out opacity-100 translate-y-0 border-primary bg-white p-3 rounded-xl shadow-md">
          <p>
            Are you sure you want to delete this &apos;{selectedPatient?.name}
            &apos; from list?
          </p>
          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={()=>confirmDelete}
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

export default DisplayPatient;
