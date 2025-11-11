"use client";

import { useEffect, useState } from "react";
import UserRoleCard from "./UserRoleCard";
import AddUserModal from "./AddUserModel";
import Toaster from "../Toaster";
import { Variable } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

const UserRolesAccess = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast,setToast]=useState<{
    message:string;
    variant:"success"|"error"|"warning"

  }|null>(null);

  async function fetchUsers() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/get-users`);
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched users data:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (id: string) => {
    console.log("Deleting user with _id:", id);

    if (!id || id === "undefined") {
      console.error("Invalid _id received:", id);
      alert("Invalid user ID");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/delete-user/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setToast({
          message:"user deleted successfully!",
          variant:"success",
        })
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Something went wrong while deleting.");
    }
  };

  if (loading) {
    return <div className="p-[20px]">Loading users...</div>;
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
    <div className="p-[20px] w-full">
      <h2 className="text-xl font-medium mb-4">User Roles & Access Control</h2>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      ) : (
        users.map((user) => (
          <UserRoleCard
            key={user._id}
            id={user._id}
            name={user.name}
            email={user.email}
         //   lastLogin="2025-08-06 09:30 AM"
            status="Active"
            role={user.role}
            // permissions={[
            //   "Full access to all settings and data",
            //   "Manage users and permissions",
            //   "Access all tools and integrations",
            // ]}
            onDelete={handleDelete}
          />
        ))
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 px-[24px] py-[16px] bg-primary rounded-2xl text-white text-[16px] hover:bg-primary-dark transition-colors"
      >
        + Add New User
      </button>

      {/* 👇 Pass fetchUsers as onUserAdded */}
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUserAdded={fetchUsers}
      />
    </div>
      </>
  );
};

export default UserRolesAccess;
