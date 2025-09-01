'use client';

import { useEffect, useState } from 'react';
import UserRoleCard from './UserRoleCard';
import AddUserModal from './AddUserModel'; // adjust this import based on your file structure
type User={
  id:string,
  name:string,
  email:string,
  password:string,
  role:string,

}

const UserRolesAccess = () => {
  const [users,setUsers]=useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function fetchUsers(){
    const res= await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/get-users`);
    const data=await res.json();
    setUsers(data)
  }
  useEffect(()=>{
    fetchUsers();
  },[])

  return (
    <div className="p-[20px] w-full">
      <h2 className="text-xl font-medium mb-4">User Roles & Access Control</h2>

     
      {users.map((user,index)=>{
        return(
          <div key={index}>
            <UserRoleCard
          name={user.name}
          email={user.email}
          lastLogin="2025-08-06 09:30 AM"
          status="Active"
          role={user.role}
          permissions={[
            'Full access to all settings and data',
            'Manage users and permissions',
            'Access all tools and integrations',
          ]}
        />
          </div>
        )
      })}

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
