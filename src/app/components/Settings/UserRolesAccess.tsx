'use client';

import { useState } from 'react';
import UserRoleCard from './UserRoleCard';
import AddUserModal from './AddUserModel'; // adjust this import based on your file structure

const UserRolesAccess = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-[20px] w-full">
      <h2 className="text-xl font-medium mb-4">User Roles & Access Control</h2>

      <div>
        <UserRoleCard
          name="Dr. Chioma"
          email="chioma@clinic.com"
          lastLogin="2025-08-06 09:30 AM"
          status="Active"
          role="Admin"
          permissions={[
            'Full access to all settings and data',
            'Manage users and permissions',
            'Access all tools and integrations',
          ]}
        />
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 px-[24px] py-[16px] bg-primary rounded-2xl text-white text-[16px]"
      >
        + Add New User
      </button>

      {/* Modal */}
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserRolesAccess;
