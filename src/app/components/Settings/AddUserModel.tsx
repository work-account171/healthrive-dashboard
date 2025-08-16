"use client";

import { useState } from "react";
import Image from "next/image";

import tick from "@/../public/icons/tick-mark.svg";
import fulla from "@/../public/icons/full-access.svg";

import adminIcon from "@/../public/icons/admin-icon.svg";
import { User } from "lucide-react";
// import { User } from "lucide-react";


export default function AddUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [sendInvite, setSendInvite] = useState(true);

  const [selectedRole, setSelectedRole] = useState({
    label: "Select Role",
    value: "",
    icon: adminIcon,
  });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles = [
    { label: "Admin", value: "admin", icon: adminIcon },
    { label: "Virtual Assistant", value: "Virtual Assistant", icon: adminIcon },
    { label: "Front Desk", value: "Front Desk", icon: adminIcon },
    { label: "Billing Team", value: "Billing Team", icon: adminIcon },
    { label: "Pharmacy Team", value: "Pharmacy Team", icon: adminIcon },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 text-xl font-bold"
        >
          ×
        </button>

     
        <h2 className="text-xl font-semibold mb-1 font-outfit">Add New User</h2>
        <p className="text-sm text-gray-500 mb-6 font-outfit">
          Create a new user account and assign their role in the system.
        </p>

       
        <form className="space-y-4">
          
          <div>
            <label className="text-sm font-medium block mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-2.5 bg-gray-100 rounded-md outline-none text-sm"
            />
          </div>
          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-4 py-2.5 bg-gray-100 rounded-md outline-none text-sm"
            />
          </div>

          {/* Custom Role Dropdown */}
          <div className="relative">
            <label className="text-sm font-medium block mb-1">Role *</label>
            <div
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-gray-100 px-4 py-2.5 rounded-md text-sm flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User
                width={17}
                height={17}
                />
                
                <span>{selectedRole.label}</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {roleDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10 px-[10px] py-[10px]">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => {
                      setSelectedRole(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors rounded-xl ${
                      selectedRole.value === role.value
                        ? "bg-primary text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    
                    <User
                width={20}
                height={17}
                />
                    <span>{role.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permissions */}
          <div>
            <label className="text-sm font-medium block mb-1">Roles Permissions *</label>
            <div className="bg-[#F3F3F5] p-4 rounded-lg text-sm text-gray-700 space-y-2">
              <div className="flex items-start gap-2">
                <Image src={tick} alt="✓" width={16} height={16} />
                <span>Full access to all settings and data</span>
              </div>
              <div className="flex items-start gap-2">
                <Image src={tick} alt="✓" width={16} height={16} />
                <span>Manage users and permissions</span>
              </div>
              <div className="flex items-start gap-2">
                <Image src={tick} alt="✓" width={16} height={16} />
                <span>Access all tools and integrations</span>
              </div>
            </div>
          </div>

          {/* Send Invite Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#03060733]">
            <div className="flex items-center gap-[14px]">
              <Image src={fulla} alt="mail" width={24} height={24} />
              <div className="flex flex-col gap-[6px] font-outfit">
                <div className="text-[20px]">Send invitation email</div>
                <div className="text-[16px]">User will receive setup instructions</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvite}
                onChange={() => setSendInvite(!sendInvite)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-all" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-[24px] py-[16px] rounded-lg border text-sm text-primary border-primary hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[24px] py-[16px] rounded-lg bg-primary text-white text-sm"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
