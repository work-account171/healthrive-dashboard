import React from "react";
import Image from "next/image";

import userIcon from "@/../public/icons/user-icon.svg";
import bellIcon from "@/../public/icons/noti-icon.svg";
import lockIcon from "@/../public/icons/account-security.svg";

const tabs = [
  { label: "User Roles & Access", icon: userIcon },
  { label: "Notifications", icon: bellIcon },
  { label: "Account & Security", icon: lockIcon },
];

type Props = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};

const SettingsTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-[270px] border h-fit px-[10px] py-[10px] rounded-lg border-[#AACDEC]">
      {tabs.map((tab, idx) => {
        const isActive = activeTab === idx;

        return (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-left transition
              ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={18}
              height={18}
              className={`shrink-0 transition ${
                isActive ? "filter invert brightness-0" : ""
              }`}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;
