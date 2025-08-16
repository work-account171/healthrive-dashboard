// components/UserRoleCard.tsx

import Image from "next/image";
import React from "react";

import tick from "@/../public/icons/tick-mark.svg"
type UserRoleCardProps = {
  name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  role: string;
  permissions: string[];
};

const UserRoleCard = ({
  name,
  email,
  lastLogin,
  status,
  role,
  permissions,
}: UserRoleCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-semibold text-2xl font-outfit pb-[10px]">
            {name}
          </div>
          <div className="text-sm text-gray-500">{email}</div>
          <div className="text-[18px] text-gray-400 mt-1 pt-[20px]">
            Last login: {lastLogin}
          </div>
        </div>
        <div className="flex gap-[20px] items-center">
          <span
            className={`px-[12px] py-[10px]  text-[16px] font-lg flex i rounded-lg gap-[6px] ${
              status === "Active"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            <Image
              src={tick}
              alt="Tick"
              width={17}
              height={17}
              className="mr-1"
            />
            {status}
          </span>
          <span className="px-[12px] py-[10px] text-white    text-[16px] bg-primary rounded-lg">
            {role}
          </span>
        </div>
      </div>

      <div>
        <div className="font-semibold text-[20px] pb-[16px]">Permissions</div>
        <ul className="text-[16px] text-black pl-0 ">
          {permissions.map((permission, idx) => (
            <li key={idx} className="flex items-start gap-[16px]">
              <Image
                src={tick}
                alt="Check"
                width={17}
                height={17}
                className="mt-1"
              />
              <span>{permission}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRoleCard;
