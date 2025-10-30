"use client";

import Image from "next/image";
import React from "react";
import { Trash2 } from "lucide-react";
import tick from "@/../public/icons/tick-mark.svg";

type UserRoleCardProps = {
  id: string;
  name: string;
  email: string;
//  lastLogin: string;
  status: "Active" | "Inactive";
  role: string;
 // permissions: string[];
  onDelete: (id: string) => void;
};

const UserRoleCard = ({
  id,
  name,
  email,
 // lastLogin,
  status,
  role,
 // permissions,
  onDelete,
}: UserRoleCardProps) => {
  const isSuperAdmin = role.toLowerCase() === "super-admin";

  const handleDeleteClick = () => {
    console.log("Delete button clicked, ID:", id); // Debug log
    if (!isSuperAdmin) {
      onDelete(id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-semibold text-1xl font-outfit pb-[10px]">
            {name}
          </div>
          <div className="text-sm text-gray-500">{email}</div>
          {/* <div className="text-[18px] text-gray-400 mt-1 pt-[20px]">
            Last login: {lastLogin}
          </div> */}
        </div>

        <div className="flex gap-[12px] items-center">
          <span
            className={`px-[12px] py-[5px] text-[12px] font-lg flex items-center rounded-lg gap-[6px] ${
              status === "Active"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            <Image src={tick} alt="Tick" width={17} height={17} />
            {status}
          </span>

          <span className="px-[12px] py-[5px] text-white text-[12px] bg-primary rounded-lg">
            {role}
          </span>

          <button
            onClick={handleDeleteClick}
            disabled={isSuperAdmin}
            className={`flex items-center justify-center gap-[6px] px-[12px] py-[5px] rounded-lg transition
              ${
                isSuperAdmin
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
              }`}
            title={
              isSuperAdmin
                ? "Super Admin cannot be deleted"
                : "Delete this user"
            }
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div>
       {/*  <div className="font-semibold text-[20px] pb-[16px]">Permissions</div>
        <ul className="text-[16px] text-black pl-0">
          {permissions.map((permission, idx) => (
            <li key={idx} className="flex items-start gap-[16px] mb-2">
              <Image src={tick} alt="Check" width={17} height={17} />
              <span>{permission}</span>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default UserRoleCard;