// "use client";

// import React from "react";
// import { useState } from "react";
// import ToolCard from "./ToolCard";
// import icon1 from "@/../public/icons/Icon.svg";
// import icon2 from "@/../public/icons/Icon2.svg";
// import icon3 from "@/../public/icons/Icon3.svg";
// import icon4 from "@/../public/icons/Icon4.svg";
// import icon5 from "@/../public/icons/Icon5.svg";
// import icon6 from "@/../public/icons/Icon6.svg";
// import icon7 from "@/../public/icons/Icon7.svg";
// import icon8 from "@/../public/icons/Icon8.svg";
// import icon9 from "@/../public/icons/Icon9.svg";
// import icon10 from "@/../public/icons/Icon10.svg";
// import icon11 from "@/../public/icons/Icon11.svg";

// const Linktool = () => {
//   const tabs = [
//     "All (12)",
//     "Clinical (4)",
//     "Communication (3)",
//     "Administrative (2)",
//     "Storage (2)",
//   ];
//   const [activeIndex, setActiveIndex] = useState(0);
//   return (
//     <div>
//       <div className="flex flex-col gap-[16px] pb-[24px]">
//         <div className="font-outfit text-3xl font-semibold">Linked Tools</div>
//         <div className="font-outfit">
//           Access all your daily practice tools in one place.
//         </div>
//       </div>
//       <div className="flex flex-col gap-[24px]">
//         <div className="rounded-2xl px-[20px] py-[24px] border border-gray-200">
//           <div className="flex flex-col gap-[20px]">
//             <div className="font-outfit text-2xl font-light">Find Tools</div>
//             <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 py-4 w-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-5 h-5 text-gray-500 mr-2"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search by patient name"
//                 className="w-full outline-none text-md placeholder-gray-500"
//               />
//             </div>
//             <div className="flex gap-4 flex-wrap mt-4">
//               {tabs.map((label, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveIndex(index)}
//                   className={`px-4 py-2 rounded-full text-sm transition
//             ${
//               activeIndex === index
//                 ? "bg-black text-white border border-black"
//                 : "bg-white text-black border border-gray-300 hover:bg-gray-100"
//             }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className=" flex flex-wrap gap-2.5 items-center">
//           <ToolCard
//             icon={icon1}
//             title="Healthie"
//             subheading="EMR & Patient Scheduling"
//             tags={["Clinical", "HIPAA", "Critical", "EMR", "Scheduling"]}
//           />
//           <ToolCard
//             icon={icon2}
//             title="Spruce"
//             subheading="Patient Communication & Fax"
//             tags={["Communication", "HIPAA", "Critical", "Fax"]}
//           />
//           <ToolCard
//             icon={icon3}
//             title="Stripe"
//             subheading="Payment Processing & Billing"
//             tags={["Administrative",  "Critical", "Billing", "Payment"]}
//           />
//           <ToolCard
//             icon={icon4}
//             title="Google Calendar"
//             subheading="Appointment Scheduling"
//             tags={["Clinical", "Critical", "Calendar", "Scheduling"]}
//           />
//           <ToolCard
//             icon={icon5}
//             title="CoverMyMeds"
//             subheading="Prior Authorization Management"
//             tags={["Clinical", "HIPAA", "Critical", "Prior Auth", "Insurance"]}
//           />
//           <ToolCard
//             icon={icon6}
//             title="Gmail/Enguard"
//             subheading="HIPAA-Complaint Email"
//             tags={["Clinical", "HIPAA", "Critical", "EMR", "Scheduling"]}
//           />
//           <ToolCard
//             icon={icon7}
//             title="Google Drive"
//             subheading="Appointment Scheduling"
//             tags={["Storage", "Files"]}
//           />
//           <ToolCard
//             icon={icon8}
//             title="Dropbox"
//             subheading="Prior Authorization Management"
//             tags={["Storage", "Files"]}
//           />
//           <ToolCard
//             icon={icon9}
//             title="Free.ai"
//             subheading="AI Note Transcription"
//             tags={["AI", "HIPAA", "Critical", "Transcription"]}
//           />
//           <ToolCard
//             icon={icon10}
//             title="Google Forms"
//             subheading="Patient Surveys & Forms"
//             tags={["Administrative", "Surveys", "Forms"]}
//           />
//           <ToolCard
//             icon={icon11}
//             title="Constant Contact"
//             subheading="Email Marketing Compaigns"
//             tags={["Communications", "Marketing", "Email"]}
//           />
//           <ToolCard
//             icon={icon1}
//             title="Trello"
//             subheading="Legacy Task Management"
//             tags={["Legacy", "Tasks"]}
//           />

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Linktool;


"use client";

import React, { useState } from "react";
import ToolCard from "./ToolCard";

import icon1 from "@/../public/icons/Icon.svg";
import icon2 from "@/../public/icons/Icon2.svg";
import icon3 from "@/../public/icons/Icon3.svg";
import icon4 from "@/../public/icons/Icon4.svg";
import icon5 from "@/../public/icons/Icon5.svg";
import icon6 from "@/../public/icons/Icon6.svg";
import icon7 from "@/../public/icons/Icon7.svg";
import icon8 from "@/../public/icons/Icon8.svg";
import icon9 from "@/../public/icons/Icon9.svg";
import icon10 from "@/../public/icons/Icon10.svg";
import icon11 from "@/../public/icons/Icon11.svg";

const Linktool = () => {
  const tabs = [
    "All (12)",
    "Clinical (4)",
    "Communication (3)",
    "Administrative (2)",
    "Storage (2)",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const tools = [
    {
      icon: icon1,
      title: "Healthie",
      subheading: "EMR & Patient Scheduling",
      tags: ["Clinical", "HIPAA", "Critical", "EMR", "Scheduling"],
    },
    {
      icon: icon2,
      title: "Spruce",
      subheading: "Patient Communication & Fax",
      tags: ["Communication", "HIPAA", "Critical", "Fax"],
    },
    {
      icon: icon3,
      title: "Stripe",
      subheading: "Payment Processing & Billing",
      tags: ["Administrative", "Critical", "Billing", "Payment"],
    },
    {
      icon: icon4,
      title: "Google Calendar",
      subheading: "Appointment Scheduling",
      tags: ["Clinical", "Critical", "Calendar", "Scheduling"],
    },
    {
      icon: icon5,
      title: "CoverMyMeds",
      subheading: "Prior Authorization Management",
      tags: ["Clinical", "HIPAA", "Critical", "Prior Auth", "Insurance"],
    },
    {
      icon: icon6,
      title: "Gmail/Enguard",
      subheading: "HIPAA-Compliant Email",
      tags: ["Clinical", "HIPAA", "Critical", "Email"],
    },
    {
      icon: icon7,
      title: "Google Drive",
      subheading: "Cloud Storage",
      tags: ["Storage", "Files"],
    },
    {
      icon: icon8,
      title: "Dropbox",
      subheading: "Cloud Storage",
      tags: ["Storage", "Files"],
    },
    {
      icon: icon9,
      title: "Free.ai",
      subheading: "AI Note Transcription",
      tags: ["AI", "HIPAA", "Critical", "Transcription"],
    },
    {
      icon: icon10,
      title: "Google Forms",
      subheading: "Patient Surveys & Forms",
      tags: ["Administrative", "Surveys", "Forms"],
    },
    {
      icon: icon11,
      title: "Constant Contact",
      subheading: "Email Marketing Campaigns",
      tags: ["Communication", "Marketing", "Email"],
    },
    {
      icon: icon1,
      title: "Trello",
      subheading: "Legacy Task Management",
      tags: ["Legacy", "Tasks"],
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const activeTabLabel = tabs[activeIndex];
    const activeCategory = activeTabLabel.split(" ")[0]; // e.g. "Clinical"

    const matchesTab =
      activeCategory === "All" || tool.tags.includes(activeCategory);

    return matchesSearch && matchesTab;
  });

  return (
    <div>
      <div className="flex flex-col gap-[16px] pb-[24px]">
        <div className="font-outfit text-3xl font-semibold">Linked Tools</div>
        <div className="font-outfit">
          Access all your daily practice tools in one place.
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div className="rounded-2xl px-[20px] py-[24px] border border-gray-200">
          <div className="flex flex-col gap-[20px]">
            <div className="font-outfit text-2xl font-light">Find Tools</div>

            <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 py-4 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by tool name or tag"
                className="w-full outline-none text-md placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 flex-wrap mt-4">
              {tabs.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    activeIndex === index
                      ? "bg-black text-white border border-black"
                      : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-y-4 items-center">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard
                key={index}
                icon={tool.icon}
                title={tool.title}
                subheading={tool.subheading}
                tags={tool.tags}
              />
            ))
          ) : (
            <div className="text-gray-500 font-outfit text-md">
              No tools match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Linktool;
