"use client";
import {
  Download,
  Eye,
  File,
  FileText,
  Image,
  Info,
  Pencil,
  Plus,
  RefreshCwIcon,
  Search,
  SlidersHorizontalIcon,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddPatientModal from "./AddPatientModal";
import EditPatientModal from "./EditPatientModal";
import Toaster from "../Toaster";
import TableShimmer from "../task-manager/TableShimmer";
import ConfirmationModal from "../confirmModal";
import AddCsvModal from "./AddCsvModal";

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
  clientId:string;
  firstName:string;
  lastName:string;
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
  const [csvModal,setcsvModal]=useState(false)
  const [editModal, setEditModal] = useState(false);
  const [patient, setPatient] = useState<Patient[]>([]);
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("All Dates");
  const [priorityFilter, setPriorityFilter] =
    useState<string>("All Priorities");

  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 7;

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
  const addcsvModal = async () => {
    if (csvModal === true) {
      setcsvModal(false);
    } else {
      setcsvModal(true);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setPatientToEdit(null);
  };

  const handleEditSuccess = () => {
    fetchPatients();
  };

  // Filters
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

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

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

  // function handleDeleteClick(patient: Patient) {
  //   setSelectedPatient(patient);
  //   if (showModal === false) {
  //     setShowModal(true);
  //   } else {
  //     setShowModal(false);
  //   }
  // }

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
      {csvModal ? <AddCsvModal/> : ""}
      {editModal && patientToEdit && (
        <EditPatientModal
          patient={patientToEdit}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
      {toast && (
        <Toaster
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          sidebar ? "translate-x-0" : "translate-x-full"
        } fixed transition-transform duration-300 ease-in-out w-full max-w-md z-50 bg-white h-screen top-0 right-0 shadow-2xl overflow-y-auto`}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
          <button
            onClick={() => {
              setSidebar(false);
              setSelectedPatient(null);
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
                {selectedPatient?.name || "Unknown Patient"}
              </h1>
              <div className="flex gap-2 flex-wrap">
                {/* <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  Active
                </span> */}
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    selectedPatient?.priority == "emergency"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {selectedPatient?.priority == "emergency" ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                      Emergency
                    </>
                  ) : (
                    "Safe"
                  )}
                </span>
              </div>
            </div>
            {selectedPatient?.description && (
              <p className="text-gray-600 text-[16px] leading-relaxed">
                {selectedPatient.description}
              </p>
            )}
            <button
              onClick={() => selectedPatient && handleDelete(selectedPatient)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl w-fit text-white flex items-center gap-2.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Trash className="w-5 h-5" />
              Delete Patient
            </button>
          </div>

          {/* Patient Information Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Patient Information
            </h3>
            <div className="flex flex-col gap-3">
              {selectedPatient?.email && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <a
                    href={`mailto:${selectedPatient.email}`}
                    className="text-[16px] text-primary hover:text-[#3565a0] hover:underline font-semibold"
                  >
                    {selectedPatient.email}
                  </a>
                </div>
              )}
              {selectedPatient?.phNumber && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Contact Number</span>
                  <span className="text-[16px] font-semibold text-gray-900">
                    {selectedPatient.phNumber}
                  </span>
                </div>
              )}
              {selectedPatient?.clientId && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Client ID</span>
                  <span className="text-[16px] font-semibold text-primary">
                    {selectedPatient.clientId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Other Information Card */}
          {selectedPatient?.description && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
                Additional Information
              </h3>
              <div className="text-[16px] text-gray-700 leading-relaxed">
                {selectedPatient.description}
              </div>
            </div>
          )}

          {/* Attachments Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Attachments
            </h3>
            <div className="flex flex-col gap-3">
              {selectedPatient?.attachments &&
              selectedPatient.attachments.length > 0 ? (
                selectedPatient.attachments.map((attachment) => (
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
                  No files attached to this patient
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Patient Management</h1>
          <p className="text-[16px] text-gray-600">
            View, filter, and manage all patient records with task-linked
            insights and care phase tracking.
          </p>
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => fetchPatients()}
            className="bg-white cursor-pointer hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6 transition-all duration-200 hover:border-primary hover:text-primary"
            title="Refresh patient list"
          >
            <RefreshCwIcon className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={addPatientModal}
            className="bg-primary cursor-pointer hover:bg-[#3565a0] border border-primary text-white text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </button>
          <button
            onClick={addcsvModal}
            className="bg-primary cursor-pointer hover:bg-[#3565a0] border border-primary text-white text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Upload CSV
          </button>
        </div>
      </div>
      <div className="rounded-xl py-6 px-6 flex flex-col gap-5 border my-6 border-gray-200 bg-white shadow-sm">
        <div className="flex justify-start text-xl font-bold items-center gap-3 text-gray-800">
          <SlidersHorizontalIcon className="w-5 h-5 text-primary" />
          Filters & Controls
        </div>
        <div className="flex justify-start items-start gap-4 w-full flex-wrap">
          <div className="py-3 px-4 flex justify-start items-center w-[83%] bg-gray-50 gap-3 rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full outline-0 bg-transparent text-gray-700 placeholder:text-gray-400"
              placeholder="Search by patient name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
         
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="py-3 px-4 text-[16px] border border-gray-200 text-gray-700 bg-white rounded-xl w-48 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
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
                setCurrentPage(1);
              }}
              className="py-3 px-5 text-sm font-medium text-gray-700 hover:text-primary border border-gray-300 hover:border-primary rounded-xl transition-all duration-200 bg-white"
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
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-gray-700 font-semibold text-[15px] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Status
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-primary transition-colors" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded-md shadow-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">
                        Patients in emergency have higher priority
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
                {currentPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-lg font-medium">No patients found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters or add a new patient</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/80 text-[15px] transition-all duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <span className="text-primary font-semibold">{patient.clientId || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{patient.firstName || "—"}</td>
                      <td className="px-6 py-4 text-gray-700">{patient.lastName || "—"}</td>
                      <td className="px-6 py-4">
                        <a 
                          href={`mailto:${patient.email}`}
                          className="text-primary hover:text-[#3565a0] hover:underline transition-colors"
                        >
                          {patient.email || "—"}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            patient.priority === "emergency"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : patient.priority === "safe"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {patient.priority === "emergency" ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                              Emergency
                            </>
                          ) : (
                            "Safe"
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => {
                              setSidebar(true);
                              setSelectedPatient(patient);
                            }}
                            className="bg-primary hover:bg-[#3565a0] rounded-lg text-white p-2.5 group relative transition-all duration-200 shadow-sm hover:shadow-md"
                            title="View patient details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="bg-green-600 hover:bg-green-700 rounded-lg text-white p-2.5 group relative transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Edit patient"
                          >
                            <Pencil className="w-4 h-4" />
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
                        Showing <span className="font-semibold text-gray-900">{indexOfFirstPatient + 1}</span> to{" "}
                        <span className="font-semibold text-gray-900">
                          {Math.min(indexOfLastPatient, filteredPatients.length)}
                        </span>{" "}
                        of <span className="font-semibold text-gray-900">{filteredPatients.length}</span> patients
                      </div>
                      <div className="flex justify-center  flex-wrap items-center gap-2">
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