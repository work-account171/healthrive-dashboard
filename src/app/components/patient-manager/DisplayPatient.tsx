'use client'
import { Plus } from "lucide-react"
import { useState } from "react";
import AddPatientModal from "./AddPatientModal";

function DisplayPatient() {
      const [modal, setModal] = useState(false);

  const addPatientModal = async () => {
    if (modal === true) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
    
  return (
    <>
          {modal ? <AddPatientModal /> : ""}

    
     <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Patient Management</h1>
          <p className="text-[16px]">
            View, filter, and manage all patient records with task-linked insights and care phase tracking.
          </p>
        </div>
        <button onClick={addPatientModal}
          className="bg-primary  cursor-pointer hover:bg-white hover:text-primary border border-primary text-white text-[16px] font-semibold rounded-xl flex gap-2.5 justify-center items-center py-4 px-6"
        >
          <Plus />
          Add Patient
        </button>
      </div></>
  )
}

export default DisplayPatient