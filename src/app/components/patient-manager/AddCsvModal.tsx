"use client";
import { FileText, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import Toaster from "../Toaster";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}
interface CsvRow {
  [key: string]: string | undefined;
}
const AddCsvModal = () => {
 
  const [loading, setLoading] = useState(false);

  // State variables to add
  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvRow[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    status: "success" | "error" | "loading";
    message: string;
  } | null>(null);

  // Functions to implement
  const handleCsvClick = () => {
    fileInputRef.current?.click();
  };
//   const parseCsvforPreview = (file: File) => {
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         if (results.data && results.data.length > 0) {
//           setCsvPreview(results.data.slice(0, 5));
//         }
//       },
//       error: (error) => {
//         setToast({
//           message: "error parsing cs file, please check the format!",
//           variant: "error",
//         });
//       },
//     });
//   };


//   const processCsvFile = (file: File): Promise<CsvRow[]> => {
//     return new Promise((resolve, reject) => {
//       Papa.parse(file, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (results) => {
//           if (results.errors.length > 0) {
//             reject(
//               new Error(
//                 `CSV parsing errors ${results.errors
//                   .map((e) => e.message)
//                   .join(",")}`
//               )
//             );
//             return;
//           }
//           resolve(results.data);
//         },
//         error: (error) => {
//           reject(error);
//         },
//       });
//     });
//   };

 const processCsvFile = (file: File): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<CsvRow>) => {
        if (results.errors.length > 0) {
          reject(
            new Error(
              `CSV parsing errors ${results.errors
                .map((e) => e.message)
                .join(",")}`
            )
          );
          return;
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

  const removeCsvFile = () => {
    setSelectedCsvFile(null);
    setCsvPreview([]);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const parseCsvForPreview = (file: File) => {};
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ Typed correctly
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  const router = useRouter();

  const handleCsvUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCsvFile) return;

    setLoading(true);
    setUploadStatus({ status: "loading", message: "Processing CSV file..." });
    try {
      const csvData = await processCsvFile(selectedCsvFile);
    
    // 🔍 DEBUG: Log raw CSV data
    console.log('📄 Raw CSV data:', csvData);
    console.log('📊 Number of rows:', csvData.length);
      if (csvData.length == 0) {
        throw new Error("CSV file is empty or invalid!");
      }
      const patientsData = csvData.map((row, index) => {
        return {
          clientId: row.clientId || row["clientId"] || "",
          name: row.name || row.name || row["Name"] || "",
          firstName: row.firstName || row["FirstName"] || "",
          lastName: row.lastName || row["LastName"] || "",
          email: row.email || row["Email"] || "",
          // Add any other required fields with default values
          description: "",
          phNumber: "",
          priority: "safe" as const,
          attachments: [],
        };
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/bulk-add-patients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patients: patientsData }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus({
          status: "success",
          message: `Successfully imported ${patientsData.length} patients!`,
        });
        setToast({
          message: `Successfully imported ${patientsData.length} patients!`,
          variant: "success",
        });
        setTimeout(() => {
          handleModal();
          router.refresh(); // Refresh the page data
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to import patients");
      }
    } catch (error: unknown) {
      console.error("Error uploading CSV:", error);
      setUploadStatus({
        status: "error",
        message:  "Failed to process CSV file",
      });
      setToast({
        message: "Failed to process CSV file",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type === 'text/csv') {
    setSelectedCsvFile(file);
    setUploadStatus(null);
    parseCsvForPreview(file); // This will generate the preview
  } else {
    setToast({
      message: "Please select a valid CSV file",
      variant: "error"
    });
  }
};


  const [modal, setModal] = useState(false);
  function handleModal() {
    if (modal === true) {
      setModal(false);
    } else {
      setModal(true);
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
        className={`modal z-20 bg-white rounded-xl left-1/2 transform -translate-x-1/2 overflow-y-scroll scrollbar-none border border-gray-200 py-7 flex flex-col gap-6 px-6 shadow-md w-1/2 ${
          !modal ? "absolute top-2" : "hidden"
        }`}
      >
        <X
          className="absolute top-3 right-3 border rounded-full p-1 cursor-pointer font-bold hover:text-red-500"
          onClick={handleModal}
        />
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-bold gap-4">Upload CSV</h1>
          <p className="text-gray-600 text-[16px]">
            Please upload a CSV file in order to add patients in bulk. Remember!
            Only CSV file is allowed, having clientId, Patient Name, first name,
            last Name & email as default headers.
          </p>
        </div>
        <form
          onSubmit={(e) => handleCsvUpload(e)}
          className="w-full flex flex-col gap-5"
        >
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="csvFile" className="font-semibold text-sm">
              CSV File
            </label>

            <div
              className="flex flex-col justify-center items-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-gray-500 transition"
              onClick={handleCsvClick}
            >
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">Supported formats: CSV</p>

              <input
                type="file"
                name="csvFile"
                id="csvFile"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleCsvFileChange}
              />
            </div>

            {/* Selected CSV file preview */}
            {selectedCsvFile && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-green-800">
                        {selectedCsvFile.name}
                      </p>
                      <p className="text-sm text-green-600">
                        ({(selectedCsvFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCsvFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* CSV preview - show first few rows */}
                {csvPreview && csvPreview.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-700 mb-2">
                      Preview (first 3 rows):
                    </p>
                    <div className="bg-white rounded border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(csvPreview[0]).map((header) => (
                              <th
                                key={header}
                                className="p-2 text-left font-medium border-b"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.slice(0, 3).map((row: CsvRow, index: number) => (
  <tr key={index}>
    {Object.values(row).map(
      (value: string | undefined, cellIndex: number) => (
        <td key={cellIndex} className="p-2 border-b">
          {value}
        </td>
      )
    )}
  </tr>
))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Total rows: {csvPreview.length}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Upload status */}
            {uploadStatus && (
              <div
                className={`mt-3 p-3 rounded-lg text-sm ${
                  uploadStatus.status === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : uploadStatus.status === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {uploadStatus.message}
              </div>
            )}
          </div>

          <div className="flex justify-end items-end gap-5">
            <button
              type="button"
              className="py-4 px-6 text-primary border border-primary hover:border-red-600 rounded-xl hover:text-red-600"
              onClick={handleModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCsvFile}
              className="py-4 px-6 border border-primary rounded-xl bg-primary hover:bg-white hover:text-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Upload CSV"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCsvModal;
