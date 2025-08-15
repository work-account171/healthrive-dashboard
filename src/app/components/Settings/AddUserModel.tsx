'use client';

import { useState } from 'react';
import Image from 'next/image';
import tick from "@/../public/icons/tick-mark.svg"
import fulla from "@/../public/icons/full-access.svg"


export default function AddUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sendInvite, setSendInvite] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 text-xl font-bold">
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-1">Add New User</h2>
        <p className="text-sm text-gray-500 mb-6">
          Create a new user account and assign their role in the system.
        </p>

        {/* Form */}
        <form className="space-y-4">
          {/* Full Name */}
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

          {/* Role */}
          <div>
            <label className="text-sm font-medium block mb-1">Role *</label>
            <select className="w-full px-4 py-2.5 bg-gray-100 rounded-md outline-none text-sm">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Permissions */}
          <div className=''>
            <label className="text-sm font-medium block mb-1">Roles Permissions *</label>
            <div className="bg-[#F3F3F5] p-4 rounded-lg text-sm text-gray-700 space-y-2 ">
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
          <div className="flex items-center justify-between p-4  rounded-lg border border-[#03060733]">
            <div className="flex items-center gap-2 ">
              <Image src={fulla}alt="mail" width={16} height={16} />
              <div className="text-sm">Send invitation email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvite}
                onChange={() => setSendInvite(!sendInvite)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-[24px] py-[16px] rounded-lg border text-sm  text-primary  border-primary hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[24px] py-[16px] rounded-lg bg-primary text-white text-sm "
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
