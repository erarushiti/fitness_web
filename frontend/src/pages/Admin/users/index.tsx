"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from localStorage when component mounts
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

    useEffect(() => {
    // Retrieve token and fetch users in a single useEffect
    const fetchUsers = async () => {
      const storedToken = localStorage.getItem("accessToken");
      console.log("Fetching users with token:", storedToken); // Debug token
      if (!storedToken) {
        console.warn("No token found, skipping fetch");
        setUsers([]);
        return;
      }

      setToken(storedToken);
      try {
        const res = await fetch("http://localhost:8080/api/auth", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log("Fetch response status:", res.status); // Debug response
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized or forbidden access");
        }
        const data = await res.json();
        console.log("Fetched users:", data); // Debug data
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch users failed:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`http://localhost:8080/api/auth/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    const updatedUser = {
      ...formEntries,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/auth/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updated.user : u))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const columns: Column<User>[] = [
    { header: "Email", accessor: "email" },
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Role", accessor: "role" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(users) ? users : []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit User"
        >
          {selectedUser && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {columns.map((col) => (
                <div key={col.accessor}>
                  <label className="block text-sm font-medium text-black">
                    {col.header}
                  </label>
                  {col.accessor === "role" ? (
                    <select
                      name={col.accessor}
                      defaultValue={(selectedUser as any)[col.accessor]}
                      className="w-full border p-2 rounded text-black"
                      required
                    >
                      <option value="client">Client</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <input
                      type={col.accessor === "email" ? "email" : "text"}
                      name={col.accessor}
                      defaultValue={(selectedUser as any)[col.accessor]}
                      className="w-full border p-2 rounded text-black"
                      required
                      readOnly={col.accessor === "createdAt"} // Disable editing for createdAt
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </EditModal>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Delete "${userToDelete?.email}"?`}
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}